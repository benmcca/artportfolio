export type ArtCategory = {
  id: number;
  name: string;
};

export const artCategories: ArtCategory[] = [
  { id: 1, name: "painting" },
  { id: 2, name: "drawing" },
  { id: 3, name: "woodworking" },
  { id: 4, name: "other" },
];

export type PlaceholderArt = {
  id: number;
  title: string;
  date: string;
  description: string;
  images: string[];
  category: number;
};

export const placeholderArt: PlaceholderArt[] = [
  {
    id: 1,
    title: "Untitled 1",
    date: "2021-04-18",
    description: `A quiet study of color, light, and layered texture.

  ## Looking closely

  Soft transitions gather across the surface, inviting a slower look at the relationship between atmosphere and form. The warm center is held in place by cooler edges, while thin veils of paint let earlier decisions remain visible.

  The work began with a limited palette and grew through several transparent passes of muted ochre and rose, diluted umber, and a final veil of blue-grey. The image is less about a single view than the feeling of watching light settle.`,
    images: [
      "https://picsum.photos/seed/art-1/400/400",
      "https://picsum.photos/seed/art-1-detail-1/400/400",
      "https://picsum.photos/seed/art-1-detail-2/400/400",
    ],
    category: 1,
  },
  {
    id: 2,
    title: "Untitled 2",
    date: "2024-09-06",
    description: `An exploration of rhythm and movement through expressive marks.

  ## Gesture and pace

  Each gesture carries the energy of the one before it, creating a visual pace that shifts between tension and release. The darker strokes act as accents, while quieter interruptions keep the surface from becoming predictable.

  The marks move through three distinct registers: quick, repeated lines; broad movements that slow the eye; and small pauses where the paper is left open. The result sits somewhere between drawing and notation.`,
    images: [
      "https://picsum.photos/seed/art-2/400/400",
      "https://picsum.photos/seed/art-2-detail-1/400/400",
      "https://picsum.photos/seed/art-2-detail-2/400/400",
      "https://picsum.photos/seed/art-2-detail-3/400/400",
      "https://picsum.photos/seed/art-2-detail-4/400/400",
    ],
    category: 2,
  },
  {
    id: 3,
    title: "Untitled 3",
    date: "2020-11-23",
    description: `A tactile composition inspired by natural forms and worn surfaces.

  ### Material memory

  Subtle irregularities remain visible in the material, giving the piece the feeling of something shaped gradually by time. No surface is completely even; the variation is part of the image rather than a flaw to be concealed.

  The composition draws on the quiet geometry of stones, bark, and weathered timber. Its roughness changes as the light moves across it, making the work feel different from one hour to the next. Texture becomes a record of pressure, handling, and attention.`,
    images: [
      "https://picsum.photos/seed/art-3/400/400",
      "https://picsum.photos/seed/art-3-detail-1/400/400",
    ],
    category: 3,
  },
  {
    id: 4,
    title: "Untitled 4",
    date: "2026-02-14",
    description: `A restrained arrangement that considers balance, space, and contrast.

  ## An exercise in balance

  The open areas are as deliberate as the marks themselves, allowing small changes in weight and placement to become more pronounced. Nothing competes for attention, but every shape quietly changes the pressure around it.

  The arrangement can be read from several directions. A dark form anchors the lower edge, pale intervals open the center, and a narrow vertical mark gives the eye a path outward. The piece rewards distance first, then a closer look at the small shifts in tone.`,
    images: [
      "https://picsum.photos/seed/art-4/400/400",
      "https://picsum.photos/seed/art-4-detail-1/400/400",
      "https://picsum.photos/seed/art-4-detail-2/400/400",
      "https://picsum.photos/seed/art-4-detail-3/400/400",
    ],
    category: 1,
  },
  {
    id: 5,
    title: "Untitled 5",
    date: "2023-07-29",
    description: `Soft forms and shifting tones create a sense of quiet reflection.

  ### Between memory and image

  The edges drift in and out of focus, holding the image between a remembered place and an impression that is still taking shape. The uncertainty is intentional: the subject should feel familiar without becoming fully defined.

  Colors arrive in slow intervals, moving from cool grey into rose and back again. The eye finds a shape, loses it, and then discovers another shape underneath. What remains indistinct can still carry a precise emotional weight.`,
    images: ["https://picsum.photos/seed/art-5/400/400"],
    category: 2,
  },
  {
    id: 6,
    title: "Untitled 6",
    date: "2025-01-11",
    description: `A study of material and gesture built from simple visual fragments.

  ## Built in pieces

  Together, the fragments suggest a larger structure while keeping the evidence of the hand and the process close to the surface. The joins are allowed to show, giving the work a sense of assembly rather than a polished illusion.

  The visual vocabulary is intentionally small: a repeated rectangular form, a broken edge, and a single diagonal interruption. Their repetition creates order, while the slight differences keep the composition human and irregular.`,
    images: [
      "https://picsum.photos/seed/art-6/400/400",
      "https://picsum.photos/seed/art-6-detail-1/400/400",
      "https://picsum.photos/seed/art-6-detail-2/400/400",
    ],
    category: 3,
  },
  {
    id: 7,
    title: "Untitled 7",
    date: "2022-06-03",
    description: `Warm color and layered surfaces suggest a remembered landscape.

  ## A place recalled

  The familiar colors are softened and rearranged, turning the scene into something shaped as much by feeling as by observation. The landscape is suggested rather than described, with warm passages standing in for distance, weather, and late afternoon light.

  Look for the small shifts between foreground and horizon. Ochre gathers near the base, red marks interrupt the middle distance, and a pale wash opens the upper field. The memory of the place matters more here than its exact geography.`,
    images: [
      "https://picsum.photos/seed/art-7/400/400",
      "https://picsum.photos/seed/art-7-detail-1/400/400",
      "https://picsum.photos/seed/art-7-detail-2/400/400",
      "https://picsum.photos/seed/art-7-detail-3/400/400",
      "https://picsum.photos/seed/art-7-detail-4/400/400",
    ],
    category: 1,
  },
  {
    id: 8,
    title: "Murmuration",
    date: "2026-08-21",
    description: `Acrylic and ink on canvas

  ## Repetition and pause

  Their accumulation creates moments of density and calm, giving the composition a quiet pulse that rewards close attention. The lightest lines are easy to miss, but they keep the heavier passages from becoming fixed.

  The drawing moves through a simple sequence: a line appears, the line is repeated with a small change, and the pattern breaks to leave a pause. That rhythm gives the image its sense of breathing room.`,
    images: [
      "https://picsum.photos/seed/art-8/400/400",
      "https://picsum.photos/seed/art-8-detail-1/400/400",
    ],
    category: 2,
  },
  {
    id: 9,
    title: "Untitled 9",
    date: "2021-12-09",
    description: `An understated composition focused on grain, shape, and natural detail.

  ## Letting the material lead

  The limited arrangement leaves room for the material to speak, with each variation in the surface adding character to the whole. The grain is part of the drawing; it sets a direction for the eye and gives the quieter shapes a physical presence.

  The surface shifts between smooth and open areas, creating a measured contrast without relying on strong color. The closer you stand, the more the small details begin to form their own pattern. A restrained image can still contain a great deal of movement.`,
    images: [
      "https://picsum.photos/seed/art-9/400/400",
      "https://picsum.photos/seed/art-9-detail-1/400/400",
      "https://picsum.photos/seed/art-9-detail-2/400/400",
      "https://picsum.photos/seed/art-9-detail-3/400/400",
    ],
    category: 3,
  },
  {
    id: 10,
    title: "Untitled 10",
    date: "2024-03-25",
    description: `Contrasting surfaces meet in a small study of structure and atmosphere.

  ### Structure and atmosphere

  Harder lines hold the composition in place while softer passages introduce a sense of depth and changing light. The boundaries never settle completely, so the structure feels observed rather than engineered.

  Three kinds of surface share the frame: a dry, grainy passage, a smooth field of diluted color, and a dark line that gives the eye a point of return. Together they create a compact space with more depth than its scale first suggests.`,
    images: [
      "https://picsum.photos/seed/art-10/400/400",
      "https://picsum.photos/seed/art-10-detail-1/400/400",
      "https://picsum.photos/seed/art-10-detail-2/400/400",
      "https://picsum.photos/seed/art-10-detail-3/400/400",
      "https://picsum.photos/seed/art-10-detail-4/400/400",
    ],
    category: 1,
  },
  {
    id: 11,
    title: "Untitled 11",
    date: "2025-10-17",
    description: `A layered visual note about memory, place, and the passing of time.

  ## Accumulated time

  Earlier impressions remain beneath the newer ones, allowing the image to feel accumulated rather than simply made in a single moment. The visible layers are a record of revision, with each change leaving a trace of what came before.

  The work asks for a slower kind of looking. Begin with the broad arrangement, then follow the marks that interrupt it and notice how they pull older colors back into view. Nothing is erased completely; it is only moved further from the surface.`,
    images: [
      "https://picsum.photos/seed/art-11/400/400",
      "https://picsum.photos/seed/art-11-detail-1/400/400",
      "https://picsum.photos/seed/art-11-detail-2/400/400",
    ],
    category: 2,
  },
];
