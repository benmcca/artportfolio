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
  const [carouselIndex, setCarouselIndex] = useState(0);
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
  const showPreviousCarouselItem = () => {
    setCarouselIndex(
      (currentIndex) => (currentIndex - 1 + images.length) % images.length,
    );
  };
  const showNextCarouselItem = () => {
    setCarouselIndex((currentIndex) => (currentIndex + 1) % images.length);
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
            'button:not([disabled]):not(.hidden), iframe, [tabindex]:not([tabindex="-1"])',
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

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="lg:hidden">
        {(() => {
          const media = images[carouselIndex];
          const imageUrl = typeof media === "string" ? media : media?.url;

          if (!media) {
            return null;
          }

          if (isYouTubeMedia(media)) {
            return (
              <div
                className={`${images.length > 1 ? "flex aspect-square items-center justify-center bg-surface" : "aspect-video bg-black"} w-full overflow-hidden rounded`}
              >
                <iframe
                  src={getYouTubeEmbedUrl(media)}
                  title={`${title} video`}
                  className={`${images.length > 1 ? "aspect-video h-auto" : "h-full"} w-full`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            );
          }

          return (
            <button
              type="button"
              className={`${images.length > 1 ? "aspect-square bg-surface" : "bg-transparent"} relative block w-full overflow-hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring`}
              onClick={(event) => {
                triggerButtonRef.current = event.currentTarget;
                openLightbox(carouselIndex);
              }}
              aria-label={`Enlarge ${title}, media ${carouselIndex + 1}`}
            >
              {!loadedImages[imageUrl] && (
                <div
                  className="absolute inset-0 animate-pulse bg-surface"
                  aria-hidden="true"
                />
              )}
              <Image
                src={imageUrl}
                alt={
                  carouselIndex === 0
                    ? title
                    : `${title}, media ${carouselIndex + 1}`
                }
                width={800}
                height={800}
                className={`${images.length > 1 ? "h-full object-contain" : "h-auto"} w-full transition-opacity duration-500 ${loadedImages[imageUrl] ? "opacity-100" : "opacity-0"}`}
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
        })()}

        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-3 items-center">
            <button
              type="button"
              className="justify-self-start rounded-full bg-surface p-2 text-foreground transition-colors hover:bg-sidebar-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={showPreviousCarouselItem}
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" size={22} />
            </button>
            <p className="justify-self-center text-xs text-muted-foreground">
              {carouselIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              className="justify-self-end rounded-full bg-surface p-2 text-foreground transition-colors hover:bg-sidebar-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={showNextCarouselItem}
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" size={22} />
            </button>
          </div>
        )}
      </div>

      <div className="hidden space-y-2 lg:block">
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
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/15 p-4 backdrop-blur-lg transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-8 ${isLightboxVisible ? "opacity-100" : "opacity-0"}`}
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
            className="relative flex h-full w-full flex-col items-center justify-center gap-3 lg:flex-row lg:gap-0"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
          >
            {images.length > 1 && (
              <button
                type="button"
                className="hidden rounded-full p-3 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:absolute lg:left-0 lg:block"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft aria-hidden="true" size={32} />
              </button>
            )}

            {isYouTubeMedia(images[activeIndex]) ? (
              <div className="aspect-video w-full max-w-full lg:h-full lg:max-h-[calc(100%_-_10rem)] lg:max-w-[calc(100%_-_10rem)]">
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
              <div className="relative flex max-h-[calc(100%_-_4rem)] max-w-full items-center justify-center lg:max-h-[calc(100dvh_-_8rem)] lg:max-w-[calc(100%_-_10rem)]">
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
                  className={`block h-auto max-h-full max-w-full object-contain transition-opacity duration-300 lg:max-h-[calc(100dvh_-_8rem)] lg:max-w-[calc(100%_-_10rem)] ${loadedImages[typeof images[activeIndex] === "string" ? images[activeIndex] : images[activeIndex].url] ? "opacity-100" : "opacity-0"}`}
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
                className="hidden rounded-full p-3 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:absolute lg:right-0 lg:block"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight aria-hidden="true" size={32} />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid w-full max-w-xs grid-cols-3 items-center lg:hidden">
              <button
                type="button"
                className="justify-self-start rounded-full p-2 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft aria-hidden="true" size={28} />
              </button>
              <p className="justify-self-center text-sm text-white/80">
                {activeIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                className="justify-self-end rounded-full p-2 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight aria-hidden="true" size={28} />
              </button>
            </div>
          )}
          {images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-sm text-white/80 lg:block">
              {activeIndex + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
