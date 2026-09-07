import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import ImageLightbox from "../../components/ImageLightbox";
import StickyTextPanel from "../../components/StickyTextPanel";
import { getVisibleArtMedia } from "../../utils/artMedia";
import { createSupabaseServerClient } from "../../utils/supabase/server";
import type { Artwork } from "../../utils/artwork";

type ArtworkCategoryRow = { category_id: number };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artwork")
    .select("title")
    .eq("id", id)
    .eq("visible", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load artwork metadata: ${error.message}`);
  }

  return { title: data?.title ?? "Ben McCabe Art" };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin =
    !!adminEmail && userData.user?.email?.toLowerCase() === adminEmail;
  const { data, error } = await supabase
    .from("artwork")
    .select("*, artwork_categories(category_id)")
    .eq("id", id)
    .eq("visible", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load artwork: ${error.message}`);
  }

  const artwork: Artwork | null = data
    ? {
        id: data.id,
        title: data.title,
        date: data.date,
        description: data.description,
        images: data.images as Artwork["images"],
        galleryImage: data.gallery_image ?? undefined,
        visible: data.visible,
        categories: (data.artwork_categories as ArtworkCategoryRow[]).map(
          (category) => category.category_id,
        ),
      }
    : null;

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-4 text-foreground lg:py-10">
      <div className="mx-auto w-full min-w-0 max-w-[1100px]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back to portfolio"
            className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back
          </Link>

          {isAdmin && (
            <Link
              href={`/admin/artwork/${artwork.id}/edit`}
              className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <Pencil aria-hidden="true" size={16} />
              Edit
            </Link>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%] lg:gap-0">
          <ImageLightbox
            images={getVisibleArtMedia(artwork)}
            title={artwork.title}
          />
          <StickyTextPanel>
            <div className="lg:ml-6">
              <h1 className="text-3xl font-bold text-foreground">
                {artwork.title}
                <span className="ml-3 text-xl font-normal italic text-foreground">
                  {artwork.date.slice(0, 4)}
                </span>
              </h1>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 text-muted-foreground last:mb-0">
                      {children}
                    </p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 text-xl font-semibold text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 text-md font-semibold text-foreground">
                      {children}
                    </h3>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-foreground underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {artwork.description}
              </ReactMarkdown>
            </div>
          </StickyTextPanel>
        </div>
      </div>
    </main>
  );
}
