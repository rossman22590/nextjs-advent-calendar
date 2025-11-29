-- Basic schema for the Postgres version of the advent calendar

create table if not exists calendars (
  id text primary key,
  title text not null,
  notifications_enabled boolean default false
);

create table if not exists windows (
  calendar_id text not null references calendars(id) on delete cascade,
  day int not null,
  title text not null,
  text text not null,
  content jsonb not null default '[]'::jsonb,
  primary key (calendar_id, day)
);

create table if not exists subscriptions (
  calendar_id text not null references calendars(id) on delete cascade,
  token text not null,
  hour int not null default 8,
  created_at timestamptz default now(),
  primary key (calendar_id, token)
);
