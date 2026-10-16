import React from 'react';
import { useSiteContext } from '../context/SiteContext';

/** Scrolling sticker bar. Text comes from the admin panel. Hidden when empty. */
export const StickerBar: React.FC = () => {
  const { config } = useSiteContext();
  const cfg = config as any;
  const text = String(cfg.stickerText || '').trim();
  if (!text) return null;
  const speed = Number(cfg.stickerSpeed) > 0 ? Number(cfg.stickerSpeed) : 30;
  return (
    <div className="sticker-bar relative w-full"
      style={{
        backgroundColor: cfg.stickerBg || 'var(--secondary-accent, #f59e0b)',
        color: cfg.stickerTextColor || '#0f172a',
      }}>
      <div className="sticker-track py-2" style={{ animationDuration: speed + 's' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="px-8 text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap">{text}</span>
        ))}
      </div>
    </div>
  );
};
