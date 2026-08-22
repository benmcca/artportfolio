import Image from "next/image";
import { notFound } from "next/navigation";
import { placeholderArt } from "../../data/placeholderArt";

export function generateStaticParams() {
  return placeholderArt.map((art) => ({ id: String(art.id) }));
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = placeholderArt.find((item) => String(item.id) === id);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-100 px-6 py-10 text-stone-900">
      <div className="mx-auto w-[60vw] min-w-[700px] max-w-[1200px]">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          width={800}
          height={800}
          className="h-auto w-full"
        />
        <h1>{artwork.title}</h1>
      </div>
    </main>
  );
}
