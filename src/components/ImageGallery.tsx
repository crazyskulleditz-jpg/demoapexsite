import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80";

interface ImageGalleryProps {
  images: string[];
  altTitle: string;
  badge?: string;
  itemId?: string | number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altTitle, badge, itemId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Strict isolation: Normalize images safely for this exact item
  const gallery = images && images.length > 0 ? images : [FALLBACK_IMAGE];

  // Reset to first image whenever item identity changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemId, images]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 select-none">
      {/* Main Image Container */}
      <div 
        className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={`${itemId || 'gal'}-${currentIndex}-${gallery[currentIndex]}`}
            src={gallery[currentIndex]} 
            alt={`${altTitle} - View ${currentIndex + 1}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="w-full h-full object-cover select-none pointer-events-none" 
          />
        </AnimatePresence>

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
          {badge && (
            <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase">
              {badge}
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
            📸 {currentIndex + 1} / {gallery.length} Photos
          </span>
        </div>

        {/* Zoom Overlay Prompt */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Maximize2 className="w-4 h-4 text-sky-600" />
        </div>

        {/* Arrow Navigation */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all active:scale-90 z-20"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all active:scale-90 z-20"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {gallery.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 px-0.5 scrollbar-thin">
          {gallery.map((imgUrl, idx) => (
            <button
              key={`${itemId || 'thumb'}-${idx}-${imgUrl}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx 
                  ? 'border-sky-600 ring-2 ring-sky-600/30 shadow-md scale-105' 
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={imgUrl} 
                alt={`Thumbnail ${idx + 1}`} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Zoom Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-6xl w-full h-[85vh] flex items-center justify-center">
              <img 
                src={gallery[currentIndex]} 
                alt={`${altTitle} Fullscreen View`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
              />

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-mono font-bold px-4 py-2 rounded-full border border-white/10">
                Photo {currentIndex + 1} of {gallery.length} — {altTitle}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};