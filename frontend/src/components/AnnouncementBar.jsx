import { useState, useEffect } from 'react';
import { FiX, FiTruck } from 'react-icons/fi';

/**
 * AnnouncementBar — single persistent message.
 * Dismissal is stored in sessionStorage so it survives React re-renders
 * but resets when the browser tab is closed.
 */

const MESSAGE = 'Cash on Delivery available nationwide • bKash & Nagad accepted • Dhaka ৳100 / Outside ৳140';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  // Only show if not dismissed in this session
  useEffect(() => {
    if (!sessionStorage.getItem('vybe-announcement-dismissed')) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('vybe-announcement-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="bg-[#0B0B10] dark:bg-[#0B0B10] text-[#B0ACBE] dark:text-[#B0ACBE] py-2 px-4 relative"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      role="banner"
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2 pr-8">
        <FiTruck className="w-3.5 h-3.5 flex-shrink-0 text-[#8B5CF6]" aria-hidden="true" />
        <p className="text-[12px] font-medium text-center leading-tight">
          {MESSAGE}
        </p>
      </div>

      <button
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
