"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategoryFilter } from "./CategoryFilterContext";
import { getGalleryImage } from "../utils/artMedia";
import type { Artwork } from "../utils/artwork";

export default function Gallery({ artwork }: { artwork: Artwork[] }) {
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
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-[60vw] min-w-[700px] max-w-[1200px]">
        <h1 className="mb-8 text-4xl font-bold tracking-[0.08em] text-foreground capitalize">
          {heading}
        </h1>
        <div className="grid grid-cols-3 gap-x-6 gap-y-6">
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

                    return galleryImage ? (
                      <Image
                        src={
                          typeof galleryImage === "string"
                            ? galleryImage
                            : galleryImage.url
                        }
                        alt={item.title}
                        fill
                        className="block object-cover transition-[filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-50"
                        sizes="(max-width: 1200px) 33vw, 400px"
                        loading="lazy"
                      />
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
