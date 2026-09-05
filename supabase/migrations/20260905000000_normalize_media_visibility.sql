update public.artwork
set images = (
  select coalesce(jsonb_agg(
    case
      when jsonb_typeof(media) = 'object' and media ? 'hidden' then
        (media - 'hidden') || jsonb_build_object('visible', not (media->>'hidden')::boolean)
      else media
    end
    order by ordinal
  ), '[]'::jsonb)
  from jsonb_array_elements(images) with ordinality as media_rows(media, ordinal)
);