export type ArtCategory = {
  id: number;
  name: "paint" | "ink" | "wood";
};

export const artCategories: ArtCategory[] = [
  { id: 1, name: "paint" },
  { id: 2, name: "ink" },
  { id: 3, name: "wood" },
];

export type PlaceholderArt = {
  id: number;
  title: string;
  imageUrl: string;
  category: number;
};

export const placeholderArt: PlaceholderArt[] = [
  {
    id: 1,
    title: "Untitled 1",
    imageUrl: "https://picsum.photos/seed/art-1/400/400",
    category: 1,
  },
  {
    id: 2,
    title: "Untitled 2",
    imageUrl: "https://picsum.photos/seed/art-2/400/400",
    category: 2,
  },
  {
    id: 3,
    title: "Untitled 3",
    imageUrl: "https://picsum.photos/seed/art-3/400/400",
    category: 3,
  },
  {
    id: 4,
    title: "Untitled 4",
    imageUrl: "https://picsum.photos/seed/art-4/400/400",
    category: 1,
  },
  {
    id: 5,
    title: "Untitled 5",
    imageUrl: "https://picsum.photos/seed/art-5/400/400",
    category: 2,
  },
  {
    id: 6,
    title: "Untitled 6",
    imageUrl: "https://picsum.photos/seed/art-6/400/400",
    category: 3,
  },
  {
    id: 7,
    title: "Untitled 7",
    imageUrl: "https://picsum.photos/seed/art-7/400/400",
    category: 1,
  },
  {
    id: 8,
    title: "Untitled 8",
    imageUrl: "https://picsum.photos/seed/art-8/400/400",
    category: 2,
  },
  {
    id: 9,
    title: "Untitled 9",
    imageUrl: "https://picsum.photos/seed/art-9/400/400",
    category: 3,
  },
  {
    id: 10,
    title: "Untitled 10",
    imageUrl: "https://picsum.photos/seed/art-10/400/400",
    category: 1,
  },
  {
    id: 11,
    title: "Untitled 11",
    imageUrl: "https://picsum.photos/seed/art-11/400/400",
    category: 2,
  },
];
