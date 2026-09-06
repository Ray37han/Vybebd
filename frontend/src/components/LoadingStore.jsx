import './LoadingStore.css';

/**
 * LoadingStore - Lightweight, hardware-accelerated branded loader
 * Zero network assets (replaces legacy 20MB MP4 video).
 */
export default function LoadingStore({ text = "Loading your experience..." }) {
  return (
    <div className="loading-store-wrapper" role="status" aria-label={text}>
      <div className="loading-store-content">
        <div className="loading-store-spinner-box">
          {/* Ambient Glow */}
          <div className="loading-store-glow" />
          
          {/* SVG Dual-Ring Spinner */}
          <svg
            className="loading-store-svg"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="vybeLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4"
            />

            {/* Spinning Gradient Arc */}
            <circle
              className="loading-store-arc"
              cx="50"
              cy="50"
              r="40"
              stroke="url(#vybeLoaderGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="180 80"
            />
          </svg>

          {/* Center Brand Monogram */}
          <div className="loading-store-center">
            <span className="loading-store-brand">V</span>
          </div>
        </div>

        <p className="loading-store-text">{text}</p>
      </div>
    </div>
  );
}

