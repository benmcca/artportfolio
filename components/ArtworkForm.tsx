"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useActionState,
  useState,
} from "react";
import type { ArtMedia } from "../utils/artMedia";
import type { ArtCategory } from "../utils/artwork";
import type {
  ArtworkFormState,
  ArtworkFormValues,
} from "../utils/validation/artwork";

type ArtworkAction = (
  previousState: ArtworkFormState,
  formData: FormData,
) => Promise<ArtworkFormState>;

type MediaListItem = {
  type: "image" | "youtube";
  url: string;
  visible: boolean;
};

function normalizeMedia(images: ArtMedia[]): MediaListItem[] {
  return images.map((media) =>
    typeof media === "string"
      ? { type: "image", url: media, visible: true }
      : {
          type: media.type,
          url: media.url,
          visible: media.visible !== false && !media.hidden,
        },
  );
}

function getYouTubeThumbnail(url: string) {
  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.hostname === "youtu.be"
        ? parsedUrl.pathname.slice(1)
        : (parsedUrl.searchParams.get("v") ??
          parsedUrl.pathname.split("/").pop());
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

export default function ArtworkForm({
  action,
  categories,
  initialValues,
  artworkId,
}: {
  action: ArtworkAction;
  categories: ArtCategory[];
  initialValues: ArtworkFormValues;
  artworkId?: number;
}) {
  const [state, formAction, isPending] = useActionState<
    ArtworkFormState,
    FormData
  >(action, {});
  const [media, setMedia] = useState(() =>
    normalizeMedia(initialValues.images),
  );
  const [galleryImage, setGalleryImage] = useState(initialValues.galleryImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualUrlError, setManualUrlError] = useState("");

  async function uploadFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) {
      setUploadError("Choose one or more image files.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    try {
      const urls = await Promise.all(
        imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const result = (await response.json()) as {
            url?: string;
            error?: string;
          };
          if (!response.ok || !result.url) {
            throw new Error(result.error ?? "Image upload failed.");
          }
          return result.url;
        }),
      );
      setMedia((current) => [
        ...current,
        ...urls.map((url) => ({ type: "image" as const, url, visible: true })),
      ]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void uploadFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void uploadFiles(event.dataTransfer.files);
  }

  function addManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;

    try {
      const parsedUrl = new URL(url);
      const isYouTube =
        parsedUrl.hostname === "youtu.be" ||
        parsedUrl.hostname === "youtube.com" ||
        parsedUrl.hostname === "www.youtube.com";
      setMedia((current) => [
        ...current,
        { type: isYouTube ? "youtube" : "image", url, visible: true },
      ]);
      setManualUrl("");
      setManualUrlError("");
    } catch {
      setManualUrlError("Enter a valid image or YouTube URL.");
    }
  }

  function moveMedia(index: number, direction: -1 | 1) {
    setMedia((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function setGalleryMedia(item: MediaListItem) {
    if (item.type === "image") setGalleryImage(item.url);
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {artworkId && <input type="hidden" name="id" value={artworkId} />}

      <label className="block text-sm text-muted-foreground" htmlFor="title">
        Title
        <input
          id="title"
          name="title"
          required
          defaultValue={initialValues.title}
          className="mt-2 w-full rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
        {state.fieldErrors?.title && (
          <span className="mt-2 block text-xs text-red-300">
            {state.fieldErrors.title}
          </span>
        )}
      </label>

      <label className="block text-sm text-muted-foreground" htmlFor="date">
        Date
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={initialValues.date}
          className="mt-2 w-full rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
        {state.fieldErrors?.date && (
          <span className="mt-2 block text-xs text-red-300">
            {state.fieldErrors.date}
          </span>
        )}
      </label>

      <label
        className="block text-sm text-muted-foreground"
        htmlFor="description"
      >
        Description
        <textarea
          id="description"
          name="description"
          required
          rows={12}
          defaultValue={initialValues.description}
          className="mt-2 w-full resize-y rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
        {state.fieldErrors?.description && (
          <span className="mt-2 block text-xs text-red-300">
            {state.fieldErrors.description}
          </span>
        )}
      </label>

      <label
        className="block text-sm text-muted-foreground"
        htmlFor="imageUpload"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        Upload images
        <span className="mt-2 block cursor-pointer rounded border border-dashed border-sidebar-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground transition hover:border-focus-ring">
          {isUploading
            ? "Uploading..."
            : "Choose images or drag and drop them here"}
        </span>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />
        {uploadError && (
          <span className="mt-2 block text-xs text-red-300">{uploadError}</span>
        )}
      </label>

      <fieldset>
        <legend className="text-sm text-muted-foreground">Add from URL</legend>
        <div className="mt-2 flex gap-2">
          <input
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
            placeholder="Image or YouTube URL"
            className="min-w-0 flex-1 rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
          />
          <button
            type="button"
            onClick={addManualUrl}
            className="inline-flex items-center gap-1.5 rounded bg-sidebar-hover px-2 py-2 text-sm text-foreground transition hover:bg-sidebar-active"
          >
            <Plus aria-hidden="true" size={16} />
            Add
          </button>
        </div>
        {manualUrlError && (
          <p className="mt-2 text-xs text-red-300">{manualUrlError}</p>
        )}
      </fieldset>

      <input
        type="hidden"
        name="images"
        value={JSON.stringify(media)}
        readOnly
      />

      <fieldset>
        <legend className="text-sm text-muted-foreground">
          Media order and visibility
        </legend>
        <div className="mt-3 space-y-2">
          {media.length === 0 && (
            <p className="rounded border border-sidebar-border px-4 py-5 text-sm text-muted-foreground">
              Add an image or video above.
            </p>
          )}
          {media.map((item, index) => {
            const thumbnail =
              item.type === "youtube"
                ? getYouTubeThumbnail(item.url)
                : item.url;
            return (
              <div
                key={`${item.url}-${index}`}
                className={`flex w-full max-w-full min-w-0 items-center gap-1 overflow-hidden rounded border border-sidebar-border bg-surface p-2 ${!item.visible ? "opacity-55" : ""}`}
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-background">
                  {thumbnail ? (
                    <div
                      aria-hidden="true"
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${thumbnail}")` }}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs">
                      Video
                    </span>
                  )}
                  {item.type === "youtube" && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 text-[10px] text-white">
                      Video
                    </span>
                  )}
                </div>
                <span
                  className="block w-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground"
                  title={item.url}
                >
                  {item.url}
                </span>
                <button
                  type="button"
                  onClick={() => setGalleryMedia(item)}
                  disabled={item.type === "youtube"}
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-hover disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={
                    item.type === "youtube"
                      ? "Videos cannot be gallery images"
                      : galleryImage === item.url
                        ? "Gallery image selected"
                        : "Set as gallery image"
                  }
                  title={
                    item.type === "youtube"
                      ? "Videos cannot be gallery images"
                      : galleryImage === item.url
                        ? "Gallery image"
                        : "Set as gallery image"
                  }
                >
                  <Star
                    aria-hidden="true"
                    size={16}
                    fill={galleryImage === item.url ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => moveMedia(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-hover disabled:opacity-30"
                  aria-label="Move media up"
                >
                  <ArrowUp aria-hidden="true" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveMedia(index, 1)}
                  disabled={index === media.length - 1}
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-hover disabled:opacity-30"
                  aria-label="Move media down"
                >
                  <ArrowDown aria-hidden="true" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMedia((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, visible: !entry.visible }
                          : entry,
                      ),
                    )
                  }
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-hover"
                  aria-label={item.visible ? "Hide media" : "Show media"}
                >
                  {item.visible ? (
                    <Eye aria-hidden="true" size={16} />
                  ) : (
                    <EyeOff aria-hidden="true" size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (galleryImage === item.url) setGalleryImage("");
                    setMedia((current) =>
                      current.filter((_, entryIndex) => entryIndex !== index),
                    );
                  }}
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-hover"
                  aria-label="Remove media"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            );
          })}
        </div>
        {state.fieldErrors?.images && (
          <p className="mt-2 text-xs text-red-300">
            {state.fieldErrors.images}
          </p>
        )}
      </fieldset>

      <input type="hidden" name="galleryImage" value={galleryImage} readOnly />

      <fieldset>
        <legend className="text-sm text-muted-foreground">Categories</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                name="categories"
                value={category.id}
                defaultChecked={initialValues.categories.includes(category.id)}
                className="h-4 w-4 accent-[var(--focus-ring)]"
              />
              <span className="capitalize">{category.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-sidebar-active px-4 py-3 text-sm font-bold text-sidebar-active-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : artworkId
              ? "Save changes"
              : "Post artwork"}
        </button>
        <Link
          href="/admin"
          className="rounded px-4 py-3 text-sm text-muted-foreground transition hover:bg-sidebar-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
