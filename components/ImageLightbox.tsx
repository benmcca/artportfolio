"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImageLightboxProps = {
  images: string[];
  title: string;
};

export default function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeLightbox = () => setActiveIndex(null);
  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex - 1 + images.length) % images.length,
    );
  };
  const showNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % images.length,
    );
  };

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((currentIndex) =>
          currentIndex === null
            ? null
            : (currentIndex - 1 + images.length) % images.length,
        );
      } else if (event.key === "ArrowRight") {
        setActiveIndex((currentIndex) =>
          currentIndex === null ? null : (currentIndex + 1) % images.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="space-y-2">
        {images.map((imageUrl, imageIndex) => (
          <button
            key={imageUrl}
            type="button"
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setActiveIndex(imageIndex)}
            aria-label={`Enlarge ${title}, image ${imageIndex + 1}`}
          >
            <Image
              src={imageUrl}
              alt={
                imageIndex === 0 ? title : `${title}, image ${imageIndex + 1}`
              }
              width={800}
              height={800}
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, image ${activeIndex + 1} of ${images.length}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-4 top-4 rounded-full p-2 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={closeLightbox}
            aria-label="Close enlarged image"
          >
            <X aria-hidden="true" size={24} />
          </button>

          <div
            className="relative flex h-full w-full items-center justify-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
          >
            {images.length > 1 && (
              <button
                type="button"
                className="absolute left-0 rounded-full p-3 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft aria-hidden="true" size={32} />
              </button>
            )}

            <Image
              src={images[activeIndex]}
              alt={
                activeIndex === 0 ? title : `${title}, image ${activeIndex + 1}`
              }
              width={1600}
              height={1600}
              sizes="90vw"
              className="h-auto max-h-full w-auto max-w-[calc(100%_-_5rem)] object-contain"
              priority
            />

            {images.length > 1 && (
              <button
                type="button"
                className="absolute right-0 rounded-full p-3 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight aria-hidden="true" size={32} />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {activeIndex + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
