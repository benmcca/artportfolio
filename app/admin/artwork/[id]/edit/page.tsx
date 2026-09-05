import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ArtworkForm from "../../../../../components/ArtworkForm";
import { updateArtwork } from "../../actions";
import { createSupabaseServerClient } from "../../../../../utils/supabase/server";
import type { ArtCategory } from "../../../../../utils/artwork";
import type { ArtMedia } from "../../../../../utils/artMedia";

type CategoryRow = { category_id: number };

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId) || artworkId <= 0) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !userData.user?.email ||
    userData.user.email.toLowerCase() !== adminEmail
  ) {
    redirect("/admin/login?error=unauthorized");
  }

  const [
    { data: categories, error: categoriesError },
    { data: artwork, error },
  ] = await Promise.all([
    supabase.from("categories").select("id, name").order("id"),
    supabase
      .from("artwork")
      .select(
        "id, title, date, description, images, gallery_image, artwork_categories(category_id)",
      )
      .eq("id", artworkId)
      .maybeSingle(),
  ]);

  if (categoriesError) {
    throw new Error(`Unable to load categories: ${categoriesError.message}`);
  }
  if (error) throw new Error(`Unable to load artwork: ${error.message}`);
  if (!artwork) notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-[0.08em] text-foreground">
          Edit artwork
        </h1>
        <ArtworkForm
          action={updateArtwork}
          artworkId={artwork.id}
          categories={categories as ArtCategory[]}
          initialValues={{
            title: artwork.title,
            date: artwork.date,
            description: artwork.description,
            galleryImage: artwork.gallery_image ?? "",
            images: artwork.images as ArtMedia[],
            categories: (artwork.artwork_categories as CategoryRow[]).map(
              (category) => category.category_id,
            ),
          }}
        />
      </div>
    </main>
  );
}
