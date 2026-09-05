alter table public.categories
  add column sort_order integer not null default 0;

update public.categories
set sort_order = id;