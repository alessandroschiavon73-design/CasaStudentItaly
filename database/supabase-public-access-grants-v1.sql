-- CasaStudent public-access grants v1
-- Complements RLS policies with the PostgreSQL privileges required by Supabase Data API.
-- Safe to re-run.

begin;

grant usage on schema public to anon, authenticated;

grant select on table
  public.countries,
  public.cities,
  public.districts
to anon, authenticated;

-- Authenticated users reach these base tables through RLS policies.
grant select, insert, update, delete on table public.listings to authenticated;
grant select, insert, update, delete on table public.student_requests to authenticated;

-- Public browsing must use privacy-safe views, never the contact-bearing base tables.
revoke all on table public.listings from anon;
revoke all on table public.student_requests from anon;

do $$
begin
  if to_regclass('public.public_listings') is not null then
    execute 'grant select on public.public_listings to anon, authenticated';
  end if;
  if to_regclass('public.public_student_requests') is not null then
    execute 'grant select on public.public_student_requests to anon, authenticated';
  end if;
  if to_regclass('public.favorites') is not null then
    execute 'revoke all on public.favorites from anon';
    execute 'grant select, insert, update, delete on public.favorites to authenticated';
  end if;
  if to_regclass('public.listing_images') is not null then
    execute 'grant select on public.listing_images to anon, authenticated';
    execute 'grant insert, update, delete on public.listing_images to authenticated';
  end if;
end $$;

commit;
