import type { ArtMedia } from "./artMedia";

export type Artwork = {
  id: number;
  title: string;
  date: string;
  description: string;
  images: ArtMedia[];
  galleryImage?: string;
  categories: number[];
};

export type ArtCategory = {
  id: number;
  name: string;
  sort_order: number;
};
