import Image from "next/image";
import Link from "next/link";
import { getGalleryImage } from "../utils/artMedia";
import type { ArtMedia } from "../utils/artMedia";

type ArtworkAdminRowData = {
  id: number;
  title: string;
  date: string;
  images: ArtMedia[];
  galleryImage?: string;
  categories: string[];
};

export default function ArtworkAdminRow({
  artwork,
}: {
  artwork: ArtworkAdminRowData;
}) {
  const galleryImage = getGalleryImage(artwork);
  const imageUrl =
    typeof galleryImage === "string" ? galleryImage : galleryImage?.url;
  const [year, month, day] = artwork.date.split("-");
  const formattedDate = `${month}/${day}/${year}`;

  return (
    <Link
      href={`/${artwork.id}`}
      className="flex items-center gap-4 rounded-lg px-3 py-5 transition-colors hover:bg-sidebar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="truncate text-md font-semibold text-foreground">
            {artwork.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {artwork.categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-sidebar-border px-2 py-1 text-xs capitalize text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <time dateTime={artwork.date} className="text-xs text-muted-foreground">
          {formattedDate}
        </time>
      </div>
      <div aria-hidden="true" className="w-16 shrink-0" />
    </Link>
  );
}
