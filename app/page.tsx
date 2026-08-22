"use client";

import Image from "next/image";
import Link from "next/link";
import { placeholderArt } from "../data/placeholderArt";
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
            <article key={art.id} className="flex flex-col">
              <Link href={`/${art.id}`}>
                <div className="overflow-hidden bg-surface">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    width={400}
                    height={400}
                    className="block h-auto w-full object-cover transition duration-300 ease-out hover:scale-[1.01] hover:brightness-75"
                    sizes="(max-width: 1200px) 33vw, 400px"
                    loading="lazy"
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
