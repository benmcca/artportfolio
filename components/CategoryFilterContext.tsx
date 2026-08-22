"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CategoryFilterContextValue = {
  selectedCategory: number | "all";
  setSelectedCategory: (category: number | "all") => void;
};

const CategoryFilterContext = createContext<
  CategoryFilterContextValue | undefined
>(undefined);

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );

  return (
    <CategoryFilterContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
}

export function useCategoryFilter() {
  const context = useContext(CategoryFilterContext);

  if (!context) {
    throw new Error(
      "useCategoryFilter must be used within CategoryFilterProvider",
    );
  }

  return context;
}
