"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabase/server";

export type CategoryFormState = {
  error?: string;
  fieldErrors?: {
    name?: string;
  };
};

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user?.email?.toLowerCase();

  return userEmail && adminEmail && userEmail === adminEmail ? supabase : null;
}

function getCategoryName(formData: FormData) {
  const value = formData.get("name");
  return typeof value === "string" ? value.trim() : "";
}

function validateCategoryName(name: string): CategoryFormState {
  return name ? {} : { fieldErrors: { name: "Name is required." } };
}

function getCategoryId(formData: FormData) {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function createCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const name = getCategoryName(formData);
  const validation = validateCategoryName(name);
  if (validation.fieldErrors) return validation;

  const supabase = await getAdminClient();
  if (!supabase) return { error: "You are not authorized to do that." };

  const { data: lastCategory, error: lastCategoryError } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastCategoryError) return { error: lastCategoryError.message };

  const { error } = await supabase.from("categories").insert({
    name,
    sort_order: (lastCategory?.sort_order ?? 0) + 1,
  });
  if (error) return { error: error.message };

  redirect("/admin");
}

export async function updateCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const categoryId = getCategoryId(formData);
  if (!categoryId) return { error: "The category id is invalid." };

  const name = getCategoryName(formData);
  const validation = validateCategoryName(name);
  if (validation.fieldErrors) return validation;

  const supabase = await getAdminClient();
  if (!supabase) return { error: "You are not authorized to do that." };

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", categoryId);
  if (error) return { error: error.message };

  redirect("/admin");
}

export async function deleteCategory(categoryId: number) {
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("The category id is invalid.");
  }

  const supabase = await getAdminClient();
  if (!supabase) throw new Error("You are not authorized to do that.");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);
  if (error) throw new Error(error.message);

  redirect("/admin");
}

export async function reorderCategories(
  categoryId: number,
  targetCategoryId: number,
) {
  if (
    !Number.isInteger(categoryId) ||
    categoryId <= 0 ||
    !Number.isInteger(targetCategoryId) ||
    targetCategoryId <= 0 ||
    categoryId === targetCategoryId
  ) {
    throw new Error("The category ids are invalid.");
  }

  const supabase = await getAdminClient();
  if (!supabase) throw new Error("You are not authorized to do that.");

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (categoriesError) throw new Error(categoriesError.message);

  const categoryIds = categories.map((category) => category.id);
  const sourceIndex = categoryIds.indexOf(categoryId);
  const targetIndex = categoryIds.indexOf(targetCategoryId);
  if (sourceIndex === -1 || targetIndex === -1) {
    throw new Error("The category could not be found.");
  }

  const [movedCategory] = categoryIds.splice(sourceIndex, 1);
  categoryIds.splice(categoryIds.indexOf(targetCategoryId), 0, movedCategory);

  const updates = categoryIds.map((id, index) =>
    supabase
      .from("categories")
      .update({ sort_order: index + 1 })
      .eq("id", id),
  );
  const results = await Promise.all(updates);
  const updateError = results.find((result) => result.error)?.error;
  if (updateError) throw new Error(updateError.message);

  redirect("/admin");
}
