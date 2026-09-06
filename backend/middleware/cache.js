import { getRedisClient } from '../config/redis.js';

/**
 * In-memory fallback LRU/TTL cache for environments without Redis
 * or when Redis is temporarily offline.
 */
const memoryCache = new Map();
const MAX_MEMORY_ENTRIES = 250;

function getFromMemory(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setInMemory(key, data, ttlSeconds) {
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) {
    // Evict oldest inserted key
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + (ttlSeconds * 1000)
  });
}

function invalidateMemory(pattern) {
  try {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  } catch {
    memoryCache.clear();
  }
}

/**
 * Normalize cache key by sorting query parameters alphabetically.
 * Ensures ?page=1&sort=newest and ?sort=newest&page=1 hit the same cache entry.
 */
const normalizeCacheKey = (url) => {
  try {
    const [path, queryString] = url.split('?');
    if (!queryString) return `cache:${url}`;
    const params = new URLSearchParams(queryString);
    const sorted = new URLSearchParams([...params.entries()].sort());
    return `cache:${path}?${sorted.toString()}`;
  } catch {
    return `cache:${url}`;
  }
};

/**
 * Dual-tier cache middleware for GET requests (In-Memory + Redis)
 * Sets standard HTTP Cache-Control and X-Cache headers for CDN/browser edge caching.
 * @param {number} duration - Cache duration in seconds (default from CACHE_TTL env or 60)
 */
export const cacheMiddleware = (duration) => {
  const ttl = duration || parseInt(process.env.CACHE_TTL) || 60;

  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = normalizeCacheKey(req.originalUrl || req.url);
    const cacheControlVal = `public, max-age=${ttl}, s-maxage=${ttl * 2}, stale-while-revalidate=300`;

    // ── Tier 1: Check In-Memory Cache (0.1ms latency) ──
    const memData = getFromMemory(cacheKey);
    if (memData) {
      res.set('Cache-Control', cacheControlVal);
      res.set('X-Cache', 'HIT-MEMORY');
      return res.json(memData);
    }

    // ── Tier 2: Check Redis Cache (if available) ──
    const redisClient = getRedisClient();
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedResponse = await redisClient.get(cacheKey);
        if (cachedResponse) {
          const data = JSON.parse(cachedResponse);
          // Populate Tier 1 from Tier 2
          setInMemory(cacheKey, data, ttl);
          res.set('Cache-Control', cacheControlVal);
          res.set('X-Cache', 'HIT-REDIS');
          return res.json(data);
        }
      } catch (err) {
        console.error('Redis get error:', err.message);
      }
    }

    // ── Tier 3: Cache Miss — Override res.json to capture response ──
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Set HTTP Cache-Control for downstream CDNs and browser caches
      res.set('Cache-Control', cacheControlVal);
      res.set('X-Cache', 'MISS');

      // Populate Tier 1
      setInMemory(cacheKey, data, ttl);

      // Populate Tier 2 (Redis)
      if (redisClient && redisClient.isOpen) {
        redisClient.setEx(cacheKey, ttl, JSON.stringify(data))
          .catch(err => console.error('Redis set error:', err.message));
      }

      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache by pattern across both Redis and In-Memory caches
 * @param {string} pattern - Cache key pattern (e.g., 'cache:/api/products*')
 */
export const invalidateCache = async (pattern) => {
  const normPattern = pattern.startsWith('cache:') ? pattern : `cache:${pattern}*`;
  // Purge in-memory (check both normalized and raw pattern)
  invalidateMemory(normPattern);
  if (pattern !== normPattern) {
    invalidateMemory(pattern);
  }

  const redisClient = getRedisClient();
  if (!redisClient || !redisClient.isOpen) {
    return;
  }

  try {
    const keys = [];
    for await (const key of redisClient.scanIterator({ MATCH: normPattern, COUNT: 100 })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️  Invalidated ${keys.length} Redis cache entries matching: ${pattern}`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error.message);
  }
};

/**
 * Clear all cache in both tiers
 */
export const clearAllCache = async () => {
  memoryCache.clear();

  const redisClient = getRedisClient();
  if (!redisClient || !redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.flushDb();
    console.log('🗑️  All Redis cache cleared');
  } catch (error) {
    console.error('Clear cache error:', error.message);
  }
};

/**
 * Warm cache for popular routes on server startup.
 * Pre-populates Redis and in-memory cache with the most commonly hit product endpoints.
 * @param {string} baseUrl - Internal base URL for the API (e.g., http://localhost:5000/api)
 */
export const warmCache = async (baseUrl) => {
  const routes = [
    '/products?page=1&limit=12&sort=newest',
    '/products?page=1&limit=12&sort=trending',
    '/products?page=1&limit=12&sort=price_asc',
    '/products?page=2&limit=12&sort=newest',
  ];

  console.log('🔥 Warming cache for popular routes...');
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.ok) {
        const data = await response.json();
        const cacheKey = normalizeCacheKey(route);
        const ttl = parseInt(process.env.CACHE_TTL) || 60;
        setInMemory(cacheKey, data, ttl);

        const redisClient = getRedisClient();
        if (redisClient && redisClient.isOpen) {
          await redisClient.setEx(cacheKey, ttl, JSON.stringify(data));
        }
      }
    } catch {
      // Silently skip — cache warming is optional
    }
  }
  console.log('✅ Cache warming complete');
};
