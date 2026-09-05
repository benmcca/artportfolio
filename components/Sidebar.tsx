"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleCategorySelect(category: number | "all") {
    setSelectedCategory(category);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);

    if (pathname !== "/") {
      router.push("/");
    }
  }

  function handleAdminSelect() {
    setSelectedCategory("all");
    setIsMenuOpen(false);
    router.push("/admin");
  }

  return (
    <>
      <div className="h-20 shrink-0 lg:hidden" aria-hidden="true" />
      <aside className="fixed left-1/2 top-4 z-40 box-border flex w-[calc(100%_-_2rem)] max-w-[calc(100vw_-_2rem)] -translate-x-1/2 flex-col rounded-lg border border-sidebar-border bg-sidebar p-4 shadow-lg shadow-black/50 lg:sticky lg:left-auto lg:top-4 lg:mx-0 lg:ml-4 lg:h-[calc(100vh-2rem)] lg:w-60 lg:max-w-none lg:translate-x-0 lg:p-5">
        <div className="text-2xl font-bold tracking-[0.1em] text-foreground">
          ben mccabe
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="absolute right-4 top-3 inline-flex items-center justify-center rounded p-2 text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={22} />
          ) : (
            <Menu aria-hidden="true" size={22} />
          )}
        </button>

        <div className="mt-8 hidden space-y-2 lg:block">
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
            About me
          </a>
        </div>

        {isAdmin && (
          <div className="mt-auto hidden pt-8 lg:block">
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

        <div
          id="mobile-navigation"
          className={`${isMenuOpen ? "block" : "hidden"} px-4 pb-4 pt-3 lg:hidden`}
        >
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={`w-full rounded px-3 py-3 text-left text-sm transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
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
                className={`w-full rounded px-3 py-3 text-left text-sm capitalize transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
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
              className="block w-full rounded px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              About me
            </a>

            {isAdmin && (
              <>
                <hr className="border-0 border-t border-sidebar-border" />
                <Link
                  href="/admin"
                  onClick={(event) => {
                    event.preventDefault();
                    handleAdminSelect();
                  }}
                  aria-current={pathname === "/admin" ? "page" : undefined}
                  className={`block w-full rounded px-3 py-3 text-left text-sm transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    pathname === "/admin"
                      ? "bg-sidebar-active text-sidebar-active-foreground"
                      : "bg-transparent text-muted-foreground"
                  }`}
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
