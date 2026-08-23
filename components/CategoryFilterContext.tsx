"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type CategoryFilterContextValue = {
  selectedCategory: number | "all";
  setSelectedCategory: (category: number | "all") => void;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionHandle;
};

type ViewTransitionHandle = {
  finished: Promise<void>;
  skipTransition: () => void;
};

const CategoryFilterContext = createContext<
  CategoryFilterContextValue | undefined
>(undefined);

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const activeViewTransition = useRef<ViewTransitionHandle | null>(null);

  function updateSelectedCategory(category: number | "all") {
    if (category === selectedCategory) {
      return;
    }

    const update = () => setSelectedCategory(category);
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (
      viewTransitionDocument.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      activeViewTransition.current?.skipTransition();

      const transition = viewTransitionDocument.startViewTransition(() => {
        flushSync(update);
      });
      activeViewTransition.current = transition;
      const clearActiveViewTransition = () => {
        if (activeViewTransition.current === transition) {
          activeViewTransition.current = null;
        }
      };
      transition.finished.then(
        clearActiveViewTransition,
        clearActiveViewTransition,
      );
      return;
    }

    update();
  }

  return (
    <CategoryFilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory: updateSelectedCategory,
      }}
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
