"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import {
  createCategory,
  deleteCategory,
  reorderCategories,
} from "../app/admin/categories/actions";
import type { ArtCategory } from "../utils/artwork";

export default function CategoryManager({
  categories,
}: {
  categories: ArtCategory[];
}) {
  const [state, formAction, isCreating] = useActionState(createCategory, {});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isReordering, startReordering] = useTransition();

  function handleCategoryClick(categoryId: number) {
    if (isReordering) return;

    if (selectedCategoryId === null) {
      setSelectedCategoryId(categoryId);
      return;
    }

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      return;
    }

    startReordering(() => {
      void reorderCategories(selectedCategoryId, categoryId).then(
        () => setSelectedCategoryId(null),
        () => setSelectedCategoryId(null),
      );
    });
  }

  return (
    <section className="rounded-lg border border-sidebar-border bg-sidebar p-5">
      <h2 className="text-xl font-bold text-foreground">Categories</h2>
      <form action={formAction} className="mt-5">
        <label htmlFor="category-name" className="sr-only">
          New category name
        </label>
        <input
          id="category-name"
          name="name"
          required
          autoComplete="off"
          placeholder="Add a category"
          disabled={isCreating}
          className="w-full rounded border border-sidebar-border bg-surface px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-wait disabled:opacity-60"
        />
      </form>

      {state.fieldErrors?.name && (
        <p className="mt-2 text-xs text-red-300">{state.fieldErrors.name}</p>
      )}
      {state.error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {state.error}
        </p>
      )}

      <fieldset disabled={isReordering} className="mt-5 min-w-0">
        <legend className="sr-only">Category order</legend>
        {categories.map((category, index) => (
          <div key={category.id}>
            {index > 0 && (
              <div className="my-1 border-t border-sidebar-border" />
            )}
            <CategoryRow
              category={category}
              isSelected={selectedCategoryId === category.id}
              isReordering={isReordering}
              onSelect={() => handleCategoryClick(category.id)}
            />
          </div>
        ))}
      </fieldset>
    </section>
  );
}

function CategoryRow({
  category,
  isSelected,
  isReordering,
  onSelect,
}: {
  category: ArtCategory;
  isSelected: boolean;
  isReordering: boolean;
  onSelect: () => void;
}) {
  const [isDeleteExpanded, setIsDeleteExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!isDeleteExpanded) {
      setIsDeleteExpanded(true);
      return;
    }

    setIsDeleting(true);
    await deleteCategory(category.id);
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded px-2 py-1 transition-colors hover:bg-sidebar-hover focus-within:bg-sidebar-hover ${
        isSelected ? "bg-sidebar-active text-sidebar-active-foreground" : ""
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={isReordering}
        className={`min-w-0 flex-1 truncate text-left text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-wait ${
          isSelected
            ? "text-sidebar-active-foreground"
            : "text-muted-foreground"
        }`}
      >
        {category.name}
      </button>
      <button
        type="button"
        aria-label={`Delete ${category.name}`}
        title={
          isDeleteExpanded ? "Click again to delete" : `Delete ${category.name}`
        }
        disabled={isReordering || isDeleting}
        onClick={handleDelete}
        onMouseLeave={() => setIsDeleteExpanded(false)}
        className={`flex h-6 shrink-0 items-center justify-center gap-1 rounded text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-wait disabled:opacity-60 ${
          isDeleteExpanded
            ? "w-18 bg-red-950 px-2 text-red-300 hover:bg-red-900"
            : "w-6 text-muted-foreground hover:bg-red-950 hover:text-red-300"
        }`}
      >
        <Trash2 aria-hidden="true" size={13} className="shrink-0" />
        {isDeleteExpanded && <span>Delete</span>}
      </button>
    </div>
  );
}
