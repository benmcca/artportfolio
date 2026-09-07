"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  Dispatch,
  MouseEvent,
  SetStateAction,
} from "react";
import {
  type ArtMedia,
  getImageKitBlurUrl,
  getImageKitImageUrl,
  getYouTubeVideoId,
  isImageKitUrl,
} from "../utils/artMedia";

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

type MediaRatioMap = Record<string, number>;

function getMediaUrl(media: ArtMedia) {
  return typeof media === "string" ? media : media.url;
}

function isMediaLoaded(media: ArtMedia, loadedImages: Record<string, boolean>) {
  return isYouTubeMedia(media) || loadedImages[getMediaUrl(media)] === true;
}

function getDesktopRows(images: ArtMedia[], mediaRatios: MediaRatioMap) {
  const rows: ArtMedia[][] = [];
  let remainingImages = images.slice(1);

  while (remainingImages.length > 0) {
    const rowSize = 2;
    rows.push(remainingImages.slice(0, rowSize));
    remainingImages = remainingImages.slice(rowSize);
  }

  return rows.map((row) => {
    const ratios = row.map((media) => {
      if (isYouTubeMedia(media)) {
        return 16 / 9;
      }

      return mediaRatios[getMediaUrl(media)] ?? 1;
    });
    const ratioTotal = ratios.reduce((total, ratio) => total + ratio, 0);

    return row.map((media, index) => ({
      media,
      width: `calc((100% - ${(row.length - 1) * 8}px) * ${ratios[index] / ratioTotal})`,
    }));
  });
}

export default function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [loadedCarouselImages, setLoadedCarouselImages] = useState<
    Record<string, boolean>
  >({});
  const [loadedLightboxImages, setLoadedLightboxImages] = useState<
    Record<string, boolean>
  >({});
  const [mediaRatios, setMediaRatios] = useState<MediaRatioMap>({});
  const remainingDesktopMediaLoaded = images
    .slice(1)
    .every((media) => isMediaLoaded(media, loadedImages));
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
  const isInsideDisplayedImage = (
    image: HTMLImageElement,
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!image.naturalWidth || !image.naturalHeight) {
      return true;
    }

    const bounds = image.getBoundingClientRect();
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const boundsRatio = bounds.width / bounds.height;
    const displayedWidth =
      imageRatio > boundsRatio ? bounds.width : bounds.height * imageRatio;
    const displayedHeight =
      imageRatio > boundsRatio ? bounds.width / imageRatio : bounds.height;
    const displayedLeft = bounds.left + (bounds.width - displayedWidth) / 2;
    const displayedTop = bounds.top + (bounds.height - displayedHeight) / 2;

    return (
      event.clientX >= displayedLeft &&
      event.clientX <= displayedLeft + displayedWidth &&
      event.clientY >= displayedTop &&
      event.clientY <= displayedTop + displayedHeight
    );
  };
  const handleLightboxMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (target instanceof HTMLImageElement) {
      if (isInsideDisplayedImage(target, event)) {
        return;
      }
    } else if (target instanceof Element && target.closest("button, iframe")) {
      return;
    }

    closeLightbox();
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

          const isImageKitImage = isImageKitUrl(imageUrl);

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
              {!loadedCarouselImages[imageUrl] && (
                <LoaderCircle
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 animate-spin text-foreground"
                  size={32}
                  aria-hidden="true"
                />
              )}
              <Image
                key={imageUrl}
                src={getImageKitImageUrl(imageUrl, 1600)}
                alt={
                  carouselIndex === 0
                    ? title
                    : `${title}, media ${carouselIndex + 1}`
                }
                width={800}
                height={800}
                className={`${images.length > 1 ? "h-full object-contain" : "h-auto"} w-full transition-opacity duration-500 ${loadedCarouselImages[imageUrl] ? "opacity-100" : "opacity-0"}`}
                placeholder={isImageKitImage ? "blur" : "empty"}
                blurDataURL={
                  isImageKitImage ? getImageKitBlurUrl(imageUrl) : undefined
                }
                onLoad={() =>
                  setLoadedCarouselImages((current) => ({
                    ...current,
                    [imageUrl]: true,
                  }))
                }
                onError={() =>
                  setLoadedCarouselImages((current) => ({
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
        {images[0] && (
          <DesktopMediaItem
            media={images[0]}
            mediaIndex={0}
            title={title}
            loadedImages={loadedImages}
            setLoadedImages={setLoadedImages}
            setMediaRatios={setMediaRatios}
            mediaRatio={mediaRatios[getMediaUrl(images[0])]}
            allMediaLoaded={remainingDesktopMediaLoaded}
            revealImmediately
            className="w-full"
            onOpen={(event) => {
              triggerButtonRef.current = event.currentTarget;
              openLightbox(0);
            }}
          />
        )}

        {getDesktopRows(images, mediaRatios).map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map(({ media, width }) => {
              const mediaIndex = images.indexOf(media);

              return (
                <DesktopMediaItem
                  key={getMediaUrl(media)}
                  media={media}
                  mediaIndex={mediaIndex}
                  title={title}
                  loadedImages={loadedImages}
                  setLoadedImages={setLoadedImages}
                  setMediaRatios={setMediaRatios}
                  mediaRatio={mediaRatios[getMediaUrl(media)]}
                  allMediaLoaded={remainingDesktopMediaLoaded}
                  style={{ width }}
                  onOpen={(event) => {
                    triggerButtonRef.current = event.currentTarget;
                    openLightbox(mediaIndex);
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 p-4 backdrop-blur-lg transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-8 ${isLightboxVisible ? "opacity-100" : "opacity-0"}`}
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
          onMouseDown={handleLightboxMouseDown}
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
            onMouseDown={handleLightboxMouseDown}
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
              <div className="relative flex h-[min(80dvh,900px)] w-[min(90vw,1200px)] items-center justify-center">
                {!loadedLightboxImages[
                  typeof images[activeIndex] === "string"
                    ? images[activeIndex]
                    : images[activeIndex].url
                ] && (
                  <LoaderCircle
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 animate-spin text-foreground"
                    size={32}
                    aria-hidden="true"
                  />
                )}
                <Image
                  key={
                    typeof images[activeIndex] === "string"
                      ? images[activeIndex]
                      : images[activeIndex].url
                  }
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
                  unoptimized
                  className={`block h-auto max-h-full max-w-full object-contain transition-opacity duration-300 lg:max-h-[calc(100dvh_-_8rem)] lg:max-w-[calc(100%_-_10rem)] ${loadedLightboxImages[typeof images[activeIndex] === "string" ? images[activeIndex] : images[activeIndex].url] ? "opacity-100" : "opacity-0"}`}
                  placeholder={
                    isImageKitUrl(
                      typeof images[activeIndex] === "string"
                        ? images[activeIndex]
                        : images[activeIndex].url,
                    )
                      ? "blur"
                      : "empty"
                  }
                  blurDataURL={
                    isImageKitUrl(
                      typeof images[activeIndex] === "string"
                        ? images[activeIndex]
                        : images[activeIndex].url,
                    )
                      ? getImageKitBlurUrl(
                          typeof images[activeIndex] === "string"
                            ? images[activeIndex]
                            : images[activeIndex].url,
                        )
                      : undefined
                  }
                  onLoad={() =>
                    setLoadedLightboxImages((current) => ({
                      ...current,
                      [typeof images[activeIndex] === "string"
                        ? images[activeIndex]
                        : images[activeIndex].url]: true,
                    }))
                  }
                  onError={() =>
                    setLoadedLightboxImages((current) => ({
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

function DesktopMediaItem({
  media,
  mediaIndex,
  title,
  loadedImages,
  setLoadedImages,
  setMediaRatios,
  mediaRatio,
  allMediaLoaded,
  revealImmediately = false,
  className,
  style,
  onOpen,
}: {
  media: ArtMedia;
  mediaIndex: number;
  title: string;
  loadedImages: Record<string, boolean>;
  setLoadedImages: Dispatch<SetStateAction<Record<string, boolean>>>;
  setMediaRatios: Dispatch<SetStateAction<MediaRatioMap>>;
  mediaRatio?: number;
  allMediaLoaded: boolean;
  revealImmediately?: boolean;
  className?: string;
  style?: CSSProperties;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const mediaUrl = getMediaUrl(media);
  const isImageKitImage = isImageKitUrl(mediaUrl);
  const displayMediaUrl = getImageKitImageUrl(mediaUrl, 1600);
  const mediaAlt =
    mediaIndex === 0 ? title : `${title}, media ${mediaIndex + 1}`;
  const ratio = isYouTubeMedia(media) ? 16 / 9 : undefined;
  const mediaLoaded = isMediaLoaded(media, loadedImages);
  const shouldReveal = revealImmediately ? mediaLoaded : allMediaLoaded;

  if (isYouTubeMedia(media)) {
    return (
      <div
        className={`${className ?? ""} overflow-hidden rounded bg-black`}
        style={{ ...style, aspectRatio: ratio }}
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
      type="button"
      className={`${className ?? ""} relative block min-w-0 cursor-pointer overflow-hidden rounded bg-surface transition-[width,aspect-ratio] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      style={{ ...style, aspectRatio: ratio ?? mediaRatio ?? 1 }}
      onClick={onOpen}
      aria-label={`Enlarge ${mediaAlt}`}
    >
      {!shouldReveal && !isImageKitImage && (
        <div
          className="absolute inset-0 animate-pulse bg-surface"
          aria-hidden="true"
        />
      )}
      <Image
        src={displayMediaUrl}
        alt={mediaAlt}
        fill
        className={`object-cover transition-opacity duration-500 ${shouldReveal || isImageKitImage ? "opacity-100" : "opacity-0"}`}
        sizes="(max-width: 1024px) 60vw, 720px"
        placeholder={isImageKitImage ? "blur" : "empty"}
        blurDataURL={isImageKitImage ? getImageKitBlurUrl(mediaUrl) : undefined}
        onLoad={(event) => {
          setLoadedImages((current) => ({ ...current, [mediaUrl]: true }));
          setMediaRatios((current) => ({
            ...current,
            [mediaUrl]:
              event.currentTarget.naturalWidth /
              event.currentTarget.naturalHeight,
          }));
        }}
        onError={() =>
          setLoadedImages((current) => ({ ...current, [mediaUrl]: true }))
        }
      />
    </button>
  );
}
