-- galleries
create table galleries (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  name text not null,
  client_email text not null,
  photographer_id uuid references auth.users,
  status text default 'pending' check (status in ('pending', 'approved', 'editing', 'complete')),
  client_note text,
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- photos
create table photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references galleries on delete cascade,
  storage_path text not null,
  filename text not null,
  sort_order int default 0,
  selected boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table galleries enable row level security;
alter table photos enable row level security;

-- Photographer policies
create policy "Photographers manage own galleries"
  on galleries for all
  using (photographer_id = auth.uid());

create policy "Photographers manage own photos"
  on photos for all
  using (
    gallery_id in (
      select id from galleries where photographer_id = auth.uid()
    )
  );

-- Public read (for client gallery token access)
create policy "Public gallery read"
  on galleries for select
  using (true);

create policy "Public photo read"
  on photos for select
  using (true);
