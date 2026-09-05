import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ArtworkForm from "../../../../components/ArtworkForm";
import { createArtwork } from "../actions";
import { createSupabaseServerClient } from "../../../../utils/supabase/server";
import type { ArtCategory } from "../../../../utils/artwork";

export default async function NewArtworkPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !userData.user?.email ||
    userData.user.email.toLowerCase() !== adminEmail
  ) {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("id");

  if (error) throw new Error(`Unable to load categories: ${error.message}`);

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
          Add artwork
        </h1>
        <ArtworkForm
          action={createArtwork}
          categories={categories as ArtCategory[]}
          initialValues={{
            title: "",
            date: "",
            description: "",
            galleryImage: "",
            images: [],
            categories: [],
          }}
        />
      </div>
    </main>
  );
}
