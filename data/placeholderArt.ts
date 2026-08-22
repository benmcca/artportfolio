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
  description: string;
  imageUrl: string;
  category: number;
};

export const placeholderArt: PlaceholderArt[] = [
  {
    id: 1,
    title: "Untitled 1",
    description: "A quiet study of color, light, and layered texture.",
    imageUrl: "https://picsum.photos/seed/art-1/400/400",
    category: 1,
  },
  {
    id: 2,
    title: "Untitled 2",
    description: "An exploration of rhythm and movement through expressive marks.",
    imageUrl: "https://picsum.photos/seed/art-2/400/400",
    category: 2,
  },
  {
    id: 3,
    title: "Untitled 3",
    description: "A tactile composition inspired by natural forms and worn surfaces.",
    imageUrl: "https://picsum.photos/seed/art-3/400/400",
    category: 3,
  },
  {
    id: 4,
    title: "Untitled 4",
    description: "A restrained arrangement that considers balance, space, and contrast.",
    imageUrl: "https://picsum.photos/seed/art-4/400/400",
    category: 1,
  },
  {
    id: 5,
    title: "Untitled 5",
    description: "Soft forms and shifting tones create a sense of quiet reflection.",
    imageUrl: "https://picsum.photos/seed/art-5/400/400",
    category: 2,
  },
  {
    id: 6,
    title: "Untitled 6",
    description: "A study of material and gesture built from simple visual fragments.",
    imageUrl: "https://picsum.photos/seed/art-6/400/400",
    category: 3,
  },
  {
    id: 7,
    title: "Untitled 7",
    description: "Warm color and layered surfaces suggest a remembered landscape.",
    imageUrl: "https://picsum.photos/seed/art-7/400/400",
    category: 1,
  },
  {
    id: 8,
    title: "Untitled 8",
    description: "Delicate lines gather into an image shaped by repetition and pause.",
    imageUrl: "https://picsum.photos/seed/art-8/400/400",
    category: 2,
  },
  {
    id: 9,
    title: "Untitled 9",
    description: "An understated composition focused on grain, shape, and natural detail.",
    imageUrl: "https://picsum.photos/seed/art-9/400/400",
    category: 3,
  },
  {
    id: 10,
    title: "Untitled 10",
    description: "Contrasting surfaces meet in a small study of structure and atmosphere.",
    imageUrl: "https://picsum.photos/seed/art-10/400/400",
    category: 1,
  },
  {
    id: 11,
    title: "Untitled 11",
    description: "A layered visual note about memory, place, and the passing of time.",
    imageUrl: "https://picsum.photos/seed/art-11/400/400",
    category: 2,
  },
];
