import { redirect } from "next/navigation";
import Link from "next/link";
import ArtworkAdminRow from "../../components/ArtworkAdminRow";
import CategoryManager from "../../components/CategoryManager";
import { createSupabaseServerClient } from "../../utils/supabase/server";
import type { Artwork, ArtCategory } from "../../utils/artwork";

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

  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (categoryError) {
    throw new Error(`Unable to load categories: ${categoryError.message}`);
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
        <div className="mt-10 grid gap-10 lg:grid-cols-10">
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage portfolio
              </h2>
              <Link
                href="/admin/artwork/new"
                className="rounded bg-sidebar-active px-3 py-2 text-sm text-sidebar-active-foreground transition-colors hover:bg-sidebar-active/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                Add artwork
              </Link>
            </div>
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
          </section>
          <div className="lg:col-span-3">
            <CategoryManager categories={categoryRows as ArtCategory[]} />
          </div>
        </div>
      </div>
    </main>
  );
}
