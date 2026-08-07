-- RassoGo — schéma Supabase
-- À exécuter une fois dans : Project > SQL Editor > New query > Run

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text not null,
  age integer,
  photo_url text,
  banner_url text,
  description text default '',
  car_photo_url text,
  moto_photo_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les profils sont visibles par tous les utilisateurs connectés"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Chacun modifie uniquement son propre profil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Crée automatiquement un profil quand un nouvel utilisateur s'inscrit
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, pseudo)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ FRIENDSHIPS (mutuelles) ============
create table public.friendships (
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

alter table public.friendships enable row level security;

create policy "Chacun voit ses propres amitiés"
  on public.friendships for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- Ajoute une amitié dans les deux sens en une seule fois
create function public.add_friend(target_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if target_id = auth.uid() then
    raise exception 'Impossible de s''ajouter soi-même';
  end if;
  insert into public.friendships (user_id, friend_id) values (auth.uid(), target_id)
    on conflict do nothing;
  insert into public.friendships (user_id, friend_id) values (target_id, auth.uid())
    on conflict do nothing;
end;
$$;

-- Retire une amitié dans les deux sens
create function public.remove_friend(target_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.friendships where user_id = auth.uid() and friend_id = target_id;
  delete from public.friendships where user_id = target_id and friend_id = auth.uid();
end;
$$;

-- ============ EVENTS (Rasso) ============
create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null check (type in ('voiture', 'moto', 'mixte')),
  address text not null,
  event_date date not null,
  event_time time not null,
  rules text default '',
  conditions text default '',
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Tous les événements sont visibles par les utilisateurs connectés"
  on public.events for select
  to authenticated
  using (true);

create policy "Créer un événement en son propre nom"
  on public.events for insert
  to authenticated
  with check (auth.uid() = creator_id);

create policy "Modifier uniquement ses propres événements"
  on public.events for update
  to authenticated
  using (auth.uid() = creator_id);

create policy "Supprimer uniquement ses propres événements"
  on public.events for delete
  to authenticated
  using (auth.uid() = creator_id);

-- ============ PRESENCE (agenda) ============
create table public.presence (
  user_id uuid not null references public.profiles(id) on delete cascade,
  present_date date not null,
  primary key (user_id, present_date)
);

alter table public.presence enable row level security;

create policy "Chacun gère sa propre présence"
  on public.presence for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============ MESSAGES ============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Voir les messages envoyés ou reçus"
  on public.messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Envoyer un message en son propre nom"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

alter publication supabase_realtime add table public.messages;

-- ============ LOCATIONS (lieux disponibles) ============
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  type text not null check (type in ('voiture', 'moto', 'mixte'))
);

alter table public.locations enable row level security;

create policy "Les lieux sont visibles par tous les utilisateurs connectés"
  on public.locations for select
  to authenticated
  using (true);

insert into public.locations (name, address, type) values
  ('Parking Carrefour', 'Aix-en-Provence', 'voiture'),
  ('Col de la Faucille', 'Gex', 'moto'),
  ('Zone industrielle', 'Vitrolles', 'mixte'),
  ('Esplanade du Port', 'Marseille', 'mixte'),
  ('Circuit Paul Ricard - Parking', 'Le Castellet', 'voiture');
