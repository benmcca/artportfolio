import { getYouTubeVideoId, type ArtMedia } from "../artMedia";

export type ArtworkFormValues = {
  title: string;
  date: string;
  description: string;
  galleryImage: string;
  images: ArtMedia[];
  categories: number[];
};

export type ArtworkFormField = "title" | "date" | "description" | "images";

export type ArtworkFormState = {
  error?: string;
  fieldErrors?: Partial<Record<ArtworkFormField, string>>;
};

function getTextValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function parseMediaUrls(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (media) =>
          typeof media === "object" &&
          media !== null &&
          typeof media.url === "string" &&
          (media.type === "image" || media.type === "youtube"),
      )
    ) {
      return parsed.map((media) => ({
        type: media.type,
        url: media.url,
        visible: media.visible !== false && !media.hidden,
      })) as ArtMedia[];
    }
  } catch {
    // Legacy records and manually pasted URLs use newline-delimited text.
  }

  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .map(
      (url): ArtMedia =>
        getYouTubeVideoId(url)
          ? { type: "youtube", url, visible: true }
          : { type: "image", url, visible: true },
    );
}

export function parseArtworkFormData(formData: FormData): ArtworkFormValues {
  return {
    title: getTextValue(formData, "title"),
    date: getTextValue(formData, "date"),
    description: getTextValue(formData, "description"),
    galleryImage: getTextValue(formData, "galleryImage"),
    images: parseMediaUrls(getTextValue(formData, "images")),
    categories: formData.getAll("categories").flatMap((value) => {
      const categoryId = Number(value);
      return Number.isInteger(categoryId) && categoryId > 0 ? [categoryId] : [];
    }),
  };
}

export function validateArtwork(values: ArtworkFormValues): ArtworkFormState {
  const fieldErrors: ArtworkFormState["fieldErrors"] = {};

  if (!values.title) fieldErrors.title = "Title is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    fieldErrors.date = "Enter a valid date.";
  }
  if (!values.description) fieldErrors.description = "Description is required.";
  if (values.images.length === 0) {
    fieldErrors.images = "Add at least one image or video URL.";
  }
  if (
    values.galleryImage &&
    !values.images.some((media) =>
      typeof media === "string"
        ? media === values.galleryImage
        : media.type === "image" && media.url === values.galleryImage,
    )
  ) {
    fieldErrors.images = "Choose a gallery image from the media list.";
  }

  return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {};
}
