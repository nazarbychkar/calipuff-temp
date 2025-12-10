"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LightboxMedia {
  url: string;
  type: string;
}

interface ProductLightboxProps {
  media: LightboxMedia[];
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export default function ProductLightbox({
  media,
  initialIndex = 0,
  onClose,
  onIndexChange,
}: ProductLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const safeMedia = media ?? [];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % safeMedia.length;
      onIndexChange?.(next);
      return next;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + safeMedia.length) % safeMedia.length;
      onIndexChange?.(next);
      return next;
    });
  };

  const currentItem = safeMedia[currentIndex];
  if (!currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/30 transition-all"
      >
        ✕
      </button>

      {safeMedia.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous media"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/30 transition-all"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next media"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/30 transition-all"
          >
            ›
          </button>
        </>
      )}

      <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
        {currentItem.type === "video" ? (
          <video
            className="max-w-full max-h-full object-contain"
            src={`/api/images/${currentItem.url}`}
            controls
            autoPlay
          />
        ) : (
          <Image
            src={`/api/images/${currentItem.url}`}
            alt="Product media"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        )}
      </div>
    </div>
  );
}

