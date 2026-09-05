export type ArtImage = {
  type: "image";
  url: string;
  visible?: boolean;
  hidden?: boolean;
};

export type ArtYouTube = {
  type: "youtube";
  url: string;
  visible?: boolean;
  hidden?: boolean;
};

export type ArtMedia = string | ArtImage | ArtYouTube;

export type ArtWithMedia = {
  images: ArtMedia[];
  galleryImage?: string;
};

export function getYouTubeVideoId(url: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  if (parsedUrl.hostname === "youtu.be") {
    return parsedUrl.pathname.slice(1);
  }

  if (
    parsedUrl.hostname === "www.youtube.com" ||
    parsedUrl.hostname === "youtube.com"
  ) {
    if (parsedUrl.pathname === "/watch") {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/")[2];
    }
  }

  return null;
}

export function getVisibleArtMedia(art: ArtWithMedia) {
  return art.images.filter((media) => {
    if (typeof media === "string") return true;
    return media.visible !== false && !media.hidden;
  });
}

export function getGalleryImage(art: ArtWithMedia) {
  const imageMedia = art.images.filter(
    (media): media is string | ArtImage =>
      typeof media === "string" || media.type === "image",
  );
  const visibleImageMedia = getVisibleArtMedia(art).filter(
    (media): media is string | ArtImage =>
      typeof media === "string" || media.type === "image",
  );

  return (
    visibleImageMedia.find((media) =>
      typeof media === "string"
        ? media === art.galleryImage
        : media.url === art.galleryImage,
    ) ??
    visibleImageMedia[0] ??
    imageMedia[0]
  );
}
