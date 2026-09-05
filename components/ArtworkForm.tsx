"use client";

import Link from "next/link";
import { useActionState } from "react";
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

function mediaToText(images: ArtMedia[]) {
  return images
    .map((image) => (typeof image === "string" ? image : image.url))
    .join("\n");
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

      <label className="block text-sm text-muted-foreground" htmlFor="images">
        Image and video URLs
        <textarea
          id="images"
          name="images"
          required
          rows={5}
          defaultValue={mediaToText(initialValues.images)}
          placeholder="One URL per line"
          className="mt-2 w-full resize-y rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
        {state.fieldErrors?.images && (
          <span className="mt-2 block text-xs text-red-300">
            {state.fieldErrors.images}
          </span>
        )}
      </label>

      <label
        className="block text-sm text-muted-foreground"
        htmlFor="galleryImage"
      >
        Gallery image URL
        <input
          id="galleryImage"
          name="galleryImage"
          defaultValue={initialValues.galleryImage}
          className="mt-2 w-full rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
      </label>

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
