import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user?.email?.toLowerCase();

  if (error || !userEmail || !adminEmail || userEmail !== adminEmail) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Private studio
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[0.08em] text-foreground">
          Admin
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Signed in as {data.user.email}
        </p>
        <div className="mt-10 rounded-lg border border-sidebar-border bg-sidebar p-6">
          <h2 className="text-xl font-bold text-foreground">
            Artwork management
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your private workspace is ready for the first admin tools.
          </p>
        </div>
      </div>
    </main>
  );
}
