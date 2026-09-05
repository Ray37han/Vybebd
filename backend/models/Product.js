import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  // ── Short description — one-liner used in Home Decor cards and SEO ──────────
  // Optional; existing poster products are unaffected.
  shortDescription: {
    type: String,
    default: '',
    trim: true,
    maxlength: 300,
  },
  // ── URL slug — SEO-friendly identifier (e.g. "solar-wobbler-cat") ──────────
  // Optional; not used in routing yet but stored for future /products/:slug
  slug: {
    type: String,
    default: '',
    trim: true,
    lowercase: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      // ── Poster Categories (original — DO NOT REMOVE) ──────────────────────
      'bikes', 'sports-cars', 'vintage-cars', 'muscle-cars', 'vector-cars',
      'football', 'football-motivational', 'cricket', 'ufc', 'nba', 'f1', 'f1-motivational',
      'marvel', 'dc', 'movies', 'tv-series', 'music', 'games',
      'motivational', 'best-selling', 'sports', 'cars',
      'abstract', 'minimalist', 'nature', 'typography', 'custom', 'anime', 'vintage', 'modern', 'other',
      // ── Home Decor Categories (new) ───────────────────────────────────────
      'home-decor',
      'cushion-cover',
      'throw-pillow',
      'wall-clock',
      'photo-frame',
      'canvas-print',
      'table-decor',
      // ── Solar Wobbler Categories (new) ────────────────────────────────────
      'solar-wobbler',
      'wobbler',
    ]
  },
  // ── Product Type — drives UI rendering in ProductDetail ───────────────────
  // Default: 'poster' → all existing products are unaffected (no migration needed)
  productType: {
    type: String,
    enum: ['poster', 'home-decor', 'wobbler'],
    default: 'poster',
    index: true,
  },
  images: [{
    url: String, // Optional - for backward compatibility
    publicId: {
      type: String,
      required: true
    },
    format: String, // Image format (jpg, png, webp)
    urls: {
      type: mongoose.Schema.Types.Mixed, // Object with thumbnail, medium, large, full URLs
      required: false
    }
  }],
  sizes: [{
    name: {
      type: String,
      required: true,
      enum: [
        // ── Poster paper sizes (original — DO NOT REMOVE) ─────────────────
        'A5', 'A4', 'A3', 'A2', 'A1', '12x18', '16x20', '18x24', '24x36',
        // ── Clothing / soft goods (Home Decor) ───────────────────────────
        'S', 'M', 'L', 'XL',
        // ── Square cushion / canvas sizes (Home Decor) ────────────────────
        '10x10', '12x12', '16x16', '18x18', '20x20', '24x24',
        // ── Clock face sizes (Home Decor) ─────────────────────────────────
        '8-inch', '10-inch', '12-inch', '14-inch',
        // ── Generic / single SKU (Wobbler) ────────────────────────────────
        'Standard', 'Single',
      ]
    },
    tier: {
      type: String,
      enum: ['Standard', 'Premium'],
      default: 'Standard'
    },
    dimensions: {
      type: String  // Changed to String to accept "8.3 x 11.7 inches" format
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    }
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  customizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    allowImageUpload: { type: Boolean, default: false },
    allowTextCustomization: { type: Boolean, default: false },
    frameColors: [String]
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestSelling: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],

  // ── Home Decor Content Fields ─────────────────────────────────────────────
  // All optional — poster documents are unaffected (default to empty).

  // Bullet-point feature list (e.g. 'Solar powered — no batteries ever')
  features: {
    type: [String],
    default: [],
  },

  // Key-value specification pairs (e.g. [{label:'Material',value:'ABS Plastic'}])
  specifications: {
    type: [
      {
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
        _id: false,
      },
    ],
    default: [],
  },

  // Accordion FAQ items (e.g. [{question:'Does it need batteries?',answer:'No.'}])
  faq: {
    type: [
      {
        question: { type: String, required: true, trim: true },
        answer:   { type: String, required: true, trim: true },
        _id: false,
      },
    ],
    default: [],
  },

  // ── SEO Metadata override ─────────────────────────────────────────────────
  // When set, these override the auto-generated SEO defaults in og.js
  metadata: {
    seoTitle:        { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    seoKeywords:     { type: String, default: '', trim: true },
    socialImage:     { type: String, default: '', trim: true }, // Cloudinary URL override
    _id: false,
  },

  // ── Normalized / Computed Fields (NON-DESTRUCTIVE) ─────────────────────────
  // These fields are derived from original data and power the smart search &
  // filtering system.  Original fields above are NEVER modified.

  normalizedName: {
    type: String,
    default: '',
  },
  normalizedCategory: {
    type: String,
    default: '',
  },
  normalizedTags: {
    type: [String],
    default: [],
  },
  searchKeywords: {
    type: [String],
    default: [],
  },
  groupKey: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

// ── Original Indexes (preserved) ───────────────────────────────────────────
// NOTE: The text index that was here (name, description, tags) has been replaced
// by the comprehensive weighted text index below (normalized_text_search) that
// includes both original and normalized fields for better search relevance.
// MongoDB only allows ONE text index per collection.
productSchema.index({ category: 1, featured: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ sold: -1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ createdAt: -1 });

// Compound indexes for common query patterns (category + sort)
productSchema.index({ category: 1, basePrice: 1 });
productSchema.index({ category: 1, basePrice: -1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ category: 1, sold: -1 });

// Active products compound indexes (most common queries)
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, basePrice: 1 });
productSchema.index({ isActive: 1, sold: -1 });
productSchema.index({ isActive: 1, 'rating.average': -1 });

// Feature-specific compound indexes
productSchema.index({ bestSelling: 1, sold: -1 });
productSchema.index({ newArrival: 1, createdAt: -1 });

// ── Smart Search & Discovery Indexes ───────────────────────────────────────
productSchema.index({ normalizedName: 1 });
productSchema.index({ normalizedCategory: 1 });
productSchema.index({ normalizedTags: 1 });
productSchema.index({ searchKeywords: 1 });
productSchema.index({ groupKey: 1 });

// Compound indexes for normalized search + filter patterns
productSchema.index({ isActive: 1, normalizedCategory: 1, basePrice: 1 });
productSchema.index({ isActive: 1, normalizedCategory: 1, createdAt: -1 });
productSchema.index({ isActive: 1, normalizedCategory: 1, sold: -1 });
productSchema.index({ isActive: 1, groupKey: 1 });

// ── productType indexes (Home Decor / Wobbler expansion) ──────────────────
productSchema.index({ isActive: 1, productType: 1, createdAt: -1 });
productSchema.index({ isActive: 1, productType: 1, normalizedCategory: 1 });

// Comprehensive text index — original + normalized fields (weighted)
productSchema.index(
  {
    normalizedName: 'text',
    name: 'text',
    description: 'text',
    normalizedCategory: 'text',
    normalizedTags: 'text',
    searchKeywords: 'text',
    tags: 'text',
  },
  {
    name: 'normalized_text_search',
    weights: {
      normalizedName: 10,
      name: 8,
      normalizedCategory: 5,
      normalizedTags: 3,
      searchKeywords: 2,
      description: 1,
      tags: 1,
    },
  }
);

export default mongoose.model('Product', productSchema);
