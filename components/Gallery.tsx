"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCategoryFilter } from "./CategoryFilterContext";
import {
  getGalleryImage,
  getImageKitBlurUrl,
  getImageKitImageUrl,
  isImageKitUrl,
} from "../utils/artMedia";
import type { Artwork } from "../utils/artwork";

export default function Gallery({ artwork }: { artwork: Artwork[] }) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const { selectedCategory, categories } = useCategoryFilter();
  const heading =
    selectedCategory === "all"
      ? "Portfolio"
      : (categories.find((category) => category.id === selectedCategory)
          ?.name ?? "Portfolio");

  const filteredArtwork = [...artwork]
    .filter(
      (item) =>
        selectedCategory === "all" ||
        item.categories.includes(selectedCategory),
    )
    .sort((firstArtwork, secondArtwork) =>
      secondArtwork.date.localeCompare(firstArtwork.date),
    );

  return (
    <main className="min-h-screen bg-background px-6 py-4 text-foreground lg:py-10">
      <div className="mx-auto w-full min-w-0 max-w-[1200px]">
        <h1 className="mb-8 text-4xl font-bold tracking-[0.08em] text-foreground capitalize">
          {heading}
        </h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
          {filteredArtwork.map((item) => (
            <article
              key={item.id}
              className="flex flex-col"
              style={{ viewTransitionName: `art-${item.id}` }}
            >
              <Link href={`/${item.id}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded">
                  {(() => {
                    const galleryImage = getGalleryImage(item);
                    const imageUrl =
                      typeof galleryImage === "string"
                        ? galleryImage
                        : galleryImage?.url;
                    const isImageKitImage = imageUrl
                      ? isImageKitUrl(imageUrl)
                      : false;

                    return galleryImage && imageUrl ? (
                      <>
                        {!loadedImages[item.id] && !isImageKitImage && (
                          <div
                            className="absolute inset-0 animate-pulse bg-surface"
                            aria-hidden="true"
                          />
                        )}
                        <Image
                          src={getImageKitImageUrl(imageUrl, 800)}
                          alt={item.title}
                          fill
                          className={`block object-cover transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-50 ${loadedImages[item.id] || isImageKitImage ? "opacity-100" : "opacity-0"}`}
                          sizes="(max-width: 1200px) 33vw, 400px"
                          placeholder={isImageKitImage ? "blur" : "empty"}
                          blurDataURL={
                            isImageKitImage
                              ? getImageKitBlurUrl(imageUrl)
                              : undefined
                          }
                          loading="lazy"
                          onLoad={() =>
                            setLoadedImages((current) => ({
                              ...current,
                              [item.id]: true,
                            }))
                          }
                          onError={() =>
                            setLoadedImages((current) => ({
                              ...current,
                              [item.id]: true,
                            }))
                          }
                        />
                      </>
                    ) : null;
                  })()}
                  <span className="font-semibold text-lg pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-foreground opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                    {item.title}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
