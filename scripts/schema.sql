-- Run this in the Supabase SQL editor before seeding

-- Subjects (e.g. Navigation, Meteorology)
create table if not exists subjects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text not null unique,
  description text,
  icon_name   text,
  sort_order  integer default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Topics within a subject
create table if not exists topics (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid references subjects(id) on delete cascade,
  name        text not null,
  sort_order  integer default 0,
  unique (subject_id, name)
);

-- Reference books
create table if not exists source_books (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid references subjects(id) on delete cascade,
  title       text not null,
  author      text,
  unique (subject_id, title)
);

-- Questions
create table if not exists questions (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid references subjects(id) on delete cascade,
  topic_id      uuid references topics(id) on delete set null,
  question_text text not null,
  difficulty    text not null check (difficulty in ('easy','medium','hard')),
  explanation   text,
  source_type   text default 'manual' check (source_type in ('manual','ai')),
  active        boolean default false,
  flagged       boolean default false,
  created_at    timestamptz default now()
);

-- Answer options (A/B/C/D)
create table if not exists question_options (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid references questions(id) on delete cascade,
  option_letter char(1) not null check (option_letter in ('A','B','C','D')),
  option_text   text not null,
  is_correct    boolean default false
);

-- Sessions
create table if not exists sessions (
  id             uuid primary key default gen_random_uuid(),
  subject_id     uuid references subjects(id),
  mode           text check (mode in ('practice','mock')),
  difficulty     text check (difficulty in ('all','easy','medium','hard')),
  question_ids   uuid[],
  created_at     timestamptz default now()
);
