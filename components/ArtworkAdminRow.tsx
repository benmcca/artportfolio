"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { deleteArtwork } from "../app/admin/artwork/actions";
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
  const router = useRouter();
  const [isDeleteExpanded, setIsDeleteExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const galleryImage = getGalleryImage(artwork);
  const imageUrl =
    typeof galleryImage === "string" ? galleryImage : galleryImage?.url;
  const [year, month, day] = artwork.date.split("-");
  const formattedDate = `${month}/${day}/${year}`;

  function handleRowKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(`/${artwork.id}`);
    }
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!isDeleteExpanded) {
      setIsDeleteExpanded(true);
      return;
    }

    setIsDeleting(true);
    await deleteArtwork(artwork.id);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/${artwork.id}`)}
      onKeyDown={handleRowKeyDown}
      className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-5 transition-colors hover:bg-sidebar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          aria-label={`Edit ${artwork.title}`}
          title={`Edit ${artwork.title}`}
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/admin/artwork/${artwork.id}/edit`);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <Pencil aria-hidden="true" size={16} />
        </button>
        <button
          type="button"
          aria-label={
            isDeleteExpanded
              ? `Delete ${artwork.title}`
              : `Delete ${artwork.title}`
          }
          title={
            isDeleteExpanded
              ? "Click again to delete"
              : `Delete ${artwork.title}`
          }
          disabled={isDeleting}
          onClick={handleDelete}
          onMouseLeave={() => setIsDeleteExpanded(false)}
          className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-wait disabled:opacity-60 ${
            isDeleteExpanded
              ? "w-[5.5rem] bg-red-950 px-3 text-red-300 hover:bg-red-900"
              : "w-9 text-muted-foreground hover:bg-red-950 hover:text-red-300"
          }`}
        >
          <Trash2 aria-hidden="true" size={16} className="shrink-0" />
          {isDeleteExpanded && <span>Delete</span>}
        </button>
      </div>
    </div>
  );
}
