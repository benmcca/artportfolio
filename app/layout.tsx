import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { CategoryFilterProvider } from "../components/CategoryFilterContext";
import Sidebar from "../components/Sidebar";
import { createSupabaseServerClient } from "../utils/supabase/server";
import type { ArtCategory } from "../utils/artwork";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Art Portfolio",
  description: "Portfolio gallery",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = createSupabaseServerClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("id");

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  const typedCategories = categories as ArtCategory[];

  return (
    <html lang="en" className={`${robotoMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <CategoryFilterProvider>
          <div className="flex min-h-screen">
            <Sidebar categories={typedCategories} />
            <div className="flex-1">{children}</div>
          </div>
        </CategoryFilterProvider>
      </body>
    </html>
  );
}
