import { redirect } from "next/navigation";
import ArtworkAdminRow from "../../components/ArtworkAdminRow";
import { createSupabaseServerClient } from "../../utils/supabase/server";
import type { Artwork } from "../../utils/artwork";

type ArtworkCategoryRow = {
  category: { name: string } | { name: string }[] | null;
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user?.email?.toLowerCase();

  if (error || !userEmail || !adminEmail || userEmail !== adminEmail) {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: artworkRows, error: artworkError } = await supabase
    .from("artwork")
    .select(
      "id, title, date, images, gallery_image, artwork_categories(category:categories(name))",
    )
    .order("date", { ascending: false });

  if (artworkError) {
    throw new Error(`Unable to load artwork: ${artworkError.message}`);
  }

  const artwork = artworkRows.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    images: item.images as Artwork["images"],
    galleryImage: item.gallery_image ?? undefined,
    categories: (item.artwork_categories as ArtworkCategoryRow[]).flatMap(
      ({ category }) =>
        Array.isArray(category)
          ? category.map((itemCategory) => itemCategory.name)
          : category
            ? [category.name]
            : [],
    ),
  }));

  return (
    <main className="min-h-screen bg-background px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mt-4 text-4xl font-bold tracking-[0.08em] text-foreground">
          Admin
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Signed in as {data.user.email}
        </p>
        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground">Manage artwork</h2>
          <div className="mt-4">
            {artwork.map((item, index) => (
              <div key={item.id}>
                {index > 0 && (
                  <div className="my-2 border-t border-sidebar-border" />
                )}
                <ArtworkAdminRow artwork={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
