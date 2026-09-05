"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { ArtCategory } from "../utils/artwork";
import { useCategoryFilter } from "./CategoryFilterContext";

export default function Sidebar({
  categories,
  isAdmin,
}: {
  categories: ArtCategory[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedCategory, setSelectedCategory } = useCategoryFilter();

  function handleCategorySelect(category: number | "all") {
    setSelectedCategory(category);

    if (pathname !== "/") {
      router.push("/");
    }
  }

  function handleAdminSelect() {
    setSelectedCategory("all");
    router.push("/admin");
  }

  return (
    <aside className="sticky top-4 ml-4 flex h-[calc(100vh-2rem)] w-60 shrink-0 flex-col rounded-lg border border-sidebar-border bg-sidebar p-5 shadow-lg shadow-black/50">
      <div className="text-2xl font-bold tracking-[0.1em] text-foreground">
        ben mccabe
      </div>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => handleCategorySelect("all")}
          className={`w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            pathname === "/" && selectedCategory === "all"
              ? "bg-sidebar-active text-sidebar-active-foreground"
              : "bg-transparent text-muted-foreground"
          }`}
        >
          Portfolio
        </button>

        <hr className="mb-2 border-0 border-t border-sidebar-border" />

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategorySelect(category.id)}
            className={`w-full rounded px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              pathname === "/" && selectedCategory === category.id
                ? "bg-sidebar-active text-sidebar-active-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}

        <hr className="mt-2 border-0 border-t border-sidebar-border" />

        <a
          href="https://benmcca.com"
          target="_blank"
          rel="noreferrer"
          className="block w-full rounded px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          About Me
        </a>
      </div>

      {isAdmin && (
        <div className="mt-auto pt-8">
          <hr className="mb-2 border-0 border-t border-sidebar-border" />
          <Link
            href="/admin"
            onClick={(event) => {
              event.preventDefault();
              handleAdminSelect();
            }}
            aria-current={pathname === "/admin" ? "page" : undefined}
            className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              pathname === "/admin"
                ? "bg-sidebar-active text-sidebar-active-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            Admin
          </Link>
        </div>
      )}
    </aside>
  );
}
