"use client";

import { useRouter } from "next/navigation";
import { artCategories } from "../data/placeholderArt";
import { useCategoryFilter } from "./CategoryFilterContext";

export default function Sidebar() {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory } = useCategoryFilter();

  function handleCategorySelect(category: number | "all") {
    setSelectedCategory(category);
    router.push("/");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-5">
      <div className="text-2xl font-bold tracking-[0.1em] text-foreground">
        ben mccabe
      </div>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => handleCategorySelect("all")}
          className={`w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            selectedCategory === "all"
              ? "bg-sidebar-active text-sidebar-active-foreground"
              : "bg-transparent text-muted-foreground"
          }`}
        >
          Portfolio
        </button>

        {artCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategorySelect(category.id)}
            className={`w-full rounded px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              selectedCategory === category.id
                ? "bg-sidebar-active text-sidebar-active-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
