-- madaco.be — Supabase schema
-- Plakken in: Supabase-project > SQL Editor > New query > Run.
-- Maak het project in een Europese regio (Frankfurt of Ierland) aan, dat
-- kan achteraf niet meer gewijzigd worden.

create table scans (
  id            uuid primary key default gen_random_uuid(),
  tijdstip      timestamptz not null default now(),
  scan          text not null,
  rol           text,
  naam          text,
  email         text,
  bedrijf       text,
  functie       text,
  grootte       text,
  sector        text,
  nieuwsbrief   boolean default false,
  bron          text,
  samenvatting  jsonb,
  antwoorden    jsonb
);

create table contact (
  id         uuid primary key default gen_random_uuid(),
  tijdstip   timestamptz not null default now(),
  naam       text,
  email      text,
  bedrijf    text,
  bericht    text,
  bron       text
);

create table events (
  id        bigserial primary key,
  tijdstip  timestamptz not null default now(),
  sessie    text,
  scan      text,
  stap      text
);

alter table scans   enable row level security;
alter table contact enable row level security;
alter table events  enable row level security;

-- Enkel toevoegen mag, nooit lezen. De publieke ("anon") sleutel komt in de
-- broncode van de site terecht, dus zonder deze regels zou je hele lijst
-- e-mailadressen open en bloot op het internet staan.
create policy "toevoegen mag" on scans   for insert to anon with check (true);
create policy "toevoegen mag" on contact for insert to anon with check (true);
create policy "toevoegen mag" on events  for insert to anon with check (true);

-- Na het runnen: Project Settings > API. Kopieer "Project URL" en de
-- "anon public" key naar:
--   - assets/js/main.js       (SUPABASE_URL / SUPABASE_ANON_KEY, bovenaan)
--   - aiscan/index.html       (SUPABASE_URL / SUPABASE_ANON_KEY, bovenaan)
