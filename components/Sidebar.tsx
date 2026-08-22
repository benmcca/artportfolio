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
    <aside className="w-64 shrink-0 border-r border-stone-300 bg-stone-200 p-5">
      <div className="text-sm uppercase tracking-[0.2em] text-stone-500">
        ben mccabe
      </div>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => handleCategorySelect("all")}
          className={`w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
            selectedCategory === "all"
              ? "bg-stone-300 text-stone-900"
              : "bg-transparent text-stone-700"
          }`}
        >
          Portfolio
        </button>

        {artCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategorySelect(category.id)}
            className={`w-full rounded px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
              selectedCategory === category.id
                ? "bg-stone-300 text-stone-900"
                : "bg-transparent text-stone-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
