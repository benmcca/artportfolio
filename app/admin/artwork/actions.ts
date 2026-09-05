"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabase/server";
import {
  parseArtworkFormData,
  validateArtwork,
  type ArtworkFormState,
} from "../../../utils/validation/artwork";

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user?.email?.toLowerCase();

  return userEmail && adminEmail && userEmail === adminEmail ? supabase : null;
}

async function saveCategories(
  supabase: NonNullable<Awaited<ReturnType<typeof getAdminClient>>>,
  artworkId: number,
  categories: number[],
) {
  if (categories.length === 0) return;

  const { error } = await supabase.from("artwork_categories").insert(
    categories.map((categoryId) => ({
      artwork_id: artworkId,
      category_id: categoryId,
    })),
  );

  if (error)
    throw new Error(`Unable to save artwork categories: ${error.message}`);
}

export async function createArtwork(
  _previousState: ArtworkFormState,
  formData: FormData,
): Promise<ArtworkFormState> {
  const values = parseArtworkFormData(formData);
  const validation = validateArtwork(values);
  if (validation.fieldErrors) return validation;

  const supabase = await getAdminClient();
  if (!supabase) return { error: "You are not authorized to do that." };

  const { data, error } = await supabase
    .from("artwork")
    .insert({
      title: values.title,
      date: values.date,
      description: values.description,
      images: values.images,
      gallery_image: values.galleryImage || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  await saveCategories(supabase, data.id, values.categories);
  redirect("/admin");
}

export async function updateArtwork(
  _previousState: ArtworkFormState,
  formData: FormData,
): Promise<ArtworkFormState> {
  const artworkId = Number(formData.get("id"));
  if (!Number.isInteger(artworkId) || artworkId <= 0) {
    return { error: "The artwork id is invalid." };
  }

  const values = parseArtworkFormData(formData);
  const validation = validateArtwork(values);
  if (validation.fieldErrors) return validation;

  const supabase = await getAdminClient();
  if (!supabase) return { error: "You are not authorized to do that." };

  const { error } = await supabase
    .from("artwork")
    .update({
      title: values.title,
      date: values.date,
      description: values.description,
      images: values.images,
      gallery_image: values.galleryImage || null,
    })
    .eq("id", artworkId);

  if (error) return { error: error.message };

  const { error: categoryDeleteError } = await supabase
    .from("artwork_categories")
    .delete()
    .eq("artwork_id", artworkId);

  if (categoryDeleteError) return { error: categoryDeleteError.message };
  await saveCategories(supabase, artworkId, values.categories);
  redirect("/admin");
}

export async function deleteArtwork(artworkId: number) {
  const supabase = await getAdminClient();
  if (!supabase) throw new Error("You are not authorized to do that.");

  const { error } = await supabase.from("artwork").delete().eq("id", artworkId);
  if (error) throw new Error(error.message);
  redirect("/admin");
}

export async function toggleArtworkVisibility(artworkId: number) {
  if (!Number.isInteger(artworkId) || artworkId <= 0) {
    throw new Error("The artwork id is invalid.");
  }

  const supabase = await getAdminClient();
  if (!supabase) throw new Error("You are not authorized to do that.");

  const { data: artwork, error: fetchError } = await supabase
    .from("artwork")
    .select("visible")
    .eq("id", artworkId)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!artwork) throw new Error("The artwork could not be found.");

  const { error } = await supabase
    .from("artwork")
    .update({ visible: !artwork.visible })
    .eq("id", artworkId);
  if (error) throw new Error(error.message);
}
