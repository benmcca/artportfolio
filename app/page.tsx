import Image from "next/image";
import { placeholderArt } from "../data/placeholderArt";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 px-6 py-10 text-stone-900">
      <div className="mx-auto w-[60vw] min-w-[700px] max-w-[1200px]">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6">
          {placeholderArt.map((art) => (
            <article key={art.id} className="flex flex-col">
              <div className="overflow-hidden bg-stone-200">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  width={400}
                  height={400}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1200px) 33vw, 400px"
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
