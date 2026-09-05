import Gallery from "../components/Gallery";
import { createSupabaseServerClient } from "../utils/supabase/server";
import type { Artwork } from "../utils/artwork";

type ArtworkCategoryRow = { category_id: number };

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artwork")
    .select("*, artwork_categories(category_id)");

  if (error) {
    throw new Error(`Unable to load artwork: ${error.message}`);
  }

  const artwork: Artwork[] = data.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    description: item.description,
    images: item.images as Artwork["images"],
    galleryImage: item.gallery_image ?? undefined,
    categories: (item.artwork_categories as ArtworkCategoryRow[]).map(
      (category) => category.category_id,
    ),
  }));

  return <Gallery artwork={artwork} />;
}
