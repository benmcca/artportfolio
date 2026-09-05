"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type ArtMedia, getYouTubeVideoId } from "../utils/artMedia";

type ImageLightboxProps = {
  images: ArtMedia[];
  title: string;
};

function isYouTubeMedia(
  media: ArtMedia,
): media is Extract<ArtMedia, { type: "youtube" }> {
  return typeof media !== "string" && media.type === "youtube";
}

function getYouTubeEmbedUrl(media: Extract<ArtMedia, { type: "youtube" }>) {
  const videoId = getYouTubeVideoId(media.url);
  if (!videoId) {
    return media.url;
  }

  const sourceUrl = new URL(media.url);
  const shareId = sourceUrl.searchParams.get("si");
  return `https://www.youtube.com/embed/${videoId}${shareId ? `?si=${shareId}` : ""}`;
}

export default function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const openLightbox = (imageIndex: number) => {
    setIsLightboxVisible(false);
    setActiveIndex(imageIndex);
  };
  const closeLightbox = () => {
    setIsLightboxVisible(false);
    triggerButtonRef.current?.focus();
  };
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
    const animationFrame = requestAnimationFrame(() => {
      setIsLightboxVisible(true);
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
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
      } else if (event.key === "Tab") {
        const focusableElements =
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
          );

        if (!focusableElements?.length) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="space-y-2">
        {images.map((media, mediaIndex) => {
          const mediaAlt =
            mediaIndex === 0 ? title : `${title}, media ${mediaIndex + 1}`;
          const imageUrl = typeof media === "string" ? media : media.url;

          if (isYouTubeMedia(media)) {
            return (
              <div
                key={media.url}
                className="aspect-video w-full overflow-hidden rounded bg-black"
              >
                <iframe
                  src={getYouTubeEmbedUrl(media)}
                  title={`${title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            );
          }

          return (
            <button
              key={imageUrl}
              type="button"
              className="relative block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={(event) => {
                triggerButtonRef.current = event.currentTarget;
                openLightbox(mediaIndex);
              }}
              aria-label={`Enlarge ${mediaAlt}`}
            >
              {!loadedImages[imageUrl] && (
                <div
                  className="absolute inset-0 animate-pulse rounded bg-surface"
                  aria-hidden="true"
                />
              )}
              <Image
                src={imageUrl}
                alt={mediaAlt}
                width={800}
                height={800}
                className={`h-auto w-full rounded transition-opacity duration-500 ${loadedImages[imageUrl] ? "opacity-100" : "opacity-0"}`}
                onLoad={() =>
                  setLoadedImages((current) => ({
                    ...current,
                    [imageUrl]: true,
                  }))
                }
                onError={() =>
                  setLoadedImages((current) => ({
                    ...current,
                    [imageUrl]: true,
                  }))
                }
              />
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/15 p-8 backdrop-blur-lg transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLightboxVisible ? "opacity-100" : "opacity-0"}`}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, media ${activeIndex + 1} of ${images.length}`}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "opacity" &&
              !isLightboxVisible
            ) {
              setActiveIndex(null);
            }
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-8 top-8 z-10 rounded-full p-2 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

            {isYouTubeMedia(images[activeIndex]) ? (
              <div className="aspect-video h-full max-h-[calc(100%_-_10rem)] max-w-[calc(100%_-_10rem)]">
                <iframe
                  src={getYouTubeEmbedUrl(images[activeIndex])}
                  title={`${title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-full max-h-[calc(100%_-_5rem)] max-w-[calc(100%_-_10rem)]">
                {!loadedImages[
                  typeof images[activeIndex] === "string"
                    ? images[activeIndex]
                    : images[activeIndex].url
                ] && (
                  <div
                    className="absolute inset-0 animate-pulse rounded bg-surface"
                    aria-hidden="true"
                  />
                )}
                <Image
                  src={
                    typeof images[activeIndex] === "string"
                      ? images[activeIndex]
                      : images[activeIndex].url
                  }
                  alt={
                    activeIndex === 0
                      ? title
                      : `${title}, image ${activeIndex + 1}`
                  }
                  width={1600}
                  height={1600}
                  sizes="90vw"
                  className={`h-full max-h-[calc(100%_-_5rem)] max-w-[calc(100%_-_10rem)] object-contain transition-opacity duration-300 ${loadedImages[typeof images[activeIndex] === "string" ? images[activeIndex] : images[activeIndex].url] ? "opacity-100" : "opacity-0"}`}
                  onLoad={() =>
                    setLoadedImages((current) => ({
                      ...current,
                      [typeof images[activeIndex] === "string"
                        ? images[activeIndex]
                        : images[activeIndex].url]: true,
                    }))
                  }
                  onError={() =>
                    setLoadedImages((current) => ({
                      ...current,
                      [typeof images[activeIndex] === "string"
                        ? images[activeIndex]
                        : images[activeIndex].url]: true,
                    }))
                  }
                  priority
                />
              </div>
            )}

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
