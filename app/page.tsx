"use client";

import Image from "next/image";
import Link from "next/link";
import { placeholderArt } from "../data/placeholderArt";
import { getGalleryImage } from "../utils/artMedia";
import { useCategoryFilter } from "../components/CategoryFilterContext";

export default function Home() {
  const { selectedCategory } = useCategoryFilter();

  const filteredArt = [...placeholderArt]
    .filter(
      (art) => selectedCategory === "all" || art.category === selectedCategory,
    )
    .sort((firstArt, secondArt) => secondArt.date.localeCompare(firstArt.date));

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-[60vw] min-w-[700px] max-w-[1200px]">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6">
          {filteredArt.map((art) => (
            <article
              key={art.id}
              className="flex flex-col"
              style={{ viewTransitionName: `art-${art.id}` }}
            >
              <Link href={`/${art.id}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded">
                  {(() => {
                    const galleryImage = getGalleryImage(art);

                    return galleryImage ? (
                      <Image
                        src={
                          typeof galleryImage === "string"
                            ? galleryImage
                            : galleryImage.url
                        }
                        alt={art.title}
                        fill
                        className="block object-cover transition-[filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-50"
                        sizes="(max-width: 1200px) 33vw, 400px"
                        loading="lazy"
                      />
                    ) : null;
                  })()}
                  <span className="font-semibold text-lg pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-foreground opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                    {art.title}
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
