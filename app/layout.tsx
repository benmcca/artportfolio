import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { CategoryFilterProvider } from "../components/CategoryFilterContext";
import Sidebar from "../components/Sidebar";
import { createSupabaseServerClient } from "../utils/supabase/server";
import type { ArtCategory } from "../utils/artwork";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Ben's Art Portfolio",
  description:
    "A personal portfolio showcasing my paintings, woodworking projects, videos, and other creative work.",
  openGraph: {
    title: "Ben's Art Portfolio",
    description:
      "A personal portfolio showcasing my paintings, woodworking projects, videos, and other creative work.",
    url: "https://benmakes.vercel.app",
    siteName: "Ben's Art Portfolio",
    type: "website",
    images: [
      {
        url: "https://benmakes.vercel.app/icon.jpg",
        width: 1315,
        height: 1313,
        alt: "Ben's Art Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben's Art Portfolio",
    description:
      "A personal portfolio showcasing my paintings, woodworking projects, videos, and other creative work.",
    images: ["https://benmakes.vercel.app/icon.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createSupabaseServerClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, sort_order, artwork_categories!inner(artwork_id)")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  const typedCategories = categories as ArtCategory[];
  const { data: userData } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin =
    !!adminEmail && userData.user?.email?.toLowerCase() === adminEmail;

  return (
    <html lang="en" className={`${jetBrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <CategoryFilterProvider categories={typedCategories}>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar categories={typedCategories} isAdmin={isAdmin} />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </CategoryFilterProvider>
      </body>
    </html>
  );
}
