-- Mubil Foundation: initial schema
-- Tables, indexes, updated_at trigger, is_admin(), RLS policies, media bucket.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create table public.events (
  id              uuid primary key default gen_random_uuid(),
  title           text not null check (char_length(title) between 1 and 200),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt         text check (char_length(excerpt) <= 300),
  description     text,
  event_date      date not null,
  start_time      time,
  end_time        time,
  venue           text,
  address         text,
  map_link        text,
  cover_image_url text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  featured        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint events_time_order check (start_time is null or end_time is null or end_time > start_time)
);

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null check (char_length(title) between 1 and 200),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt         text check (char_length(excerpt) <= 300),
  body            text,
  cover_image_url text,
  category        text,
  author          text,
  publish_date    timestamptz not null default now(),
  status          text not null default 'draft' check (status in ('draft', 'published')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 254),
  phone      text check (char_length(phone) <= 40),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (slug already indexed by its unique constraint)
-- ---------------------------------------------------------------------------

create index events_status_date_idx   on public.events (status, event_date);
create index events_featured_idx      on public.events (event_date) where featured and status = 'published';
create index posts_status_publish_idx on public.posts (status, publish_date desc);
create index posts_category_idx       on public.posts (category) where status = 'published';
create index messages_created_idx     on public.messages (created_at desc);
create index messages_unread_idx      on public.messages (created_at desc) where not read;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- is_admin(): security definer so policies can read admins without recursion
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.admins   enable row level security;
alter table public.events   enable row level security;
alter table public.posts    enable row level security;
alter table public.messages enable row level security;

-- Anonymous visitors never touch admins or messages, even before RLS applies.
revoke all on public.admins   from anon;
revoke all on public.messages from anon;

-- admins: readable only by admins. Rows are added via the SQL editor / service role.
create policy "admins: admins read"
  on public.admins for select to authenticated
  using ((select public.is_admin()));

-- events
create policy "events: public read published"
  on public.events for select to anon, authenticated
  using (status = 'published');

create policy "events: admins read all"
  on public.events for select to authenticated
  using ((select public.is_admin()));

create policy "events: admins insert"
  on public.events for insert to authenticated
  with check ((select public.is_admin()));

create policy "events: admins update"
  on public.events for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "events: admins delete"
  on public.events for delete to authenticated
  using ((select public.is_admin()));

-- posts
create policy "posts: public read published"
  on public.posts for select to anon, authenticated
  using (status = 'published');

create policy "posts: admins read all"
  on public.posts for select to authenticated
  using ((select public.is_admin()));

create policy "posts: admins insert"
  on public.posts for insert to authenticated
  with check ((select public.is_admin()));

create policy "posts: admins update"
  on public.posts for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "posts: admins delete"
  on public.posts for delete to authenticated
  using ((select public.is_admin()));

-- messages: inserts come only from the server via service role (bypasses RLS).
create policy "messages: admins read"
  on public.messages for select to authenticated
  using ((select public.is_admin()));

create policy "messages: admins update"
  on public.messages for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: public "media" bucket, admin-only writes into events/ and posts/
-- Public bucket serves files by URL without a select policy, so no public
-- listing of the bucket is exposed.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  2097152,
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do nothing;

create policy "media: admins read"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "media: admins insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] in ('events', 'posts')
    and (select public.is_admin())
  );

create policy "media: admins update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] in ('events', 'posts')
    and (select public.is_admin())
  );

create policy "media: admins delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
