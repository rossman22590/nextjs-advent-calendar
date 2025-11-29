create table if not exists user_ips (
  id serial primary key,
  user_id text not null references users(id) on delete cascade,
  ip_address text not null,
  created_at timestamptz default now()
);

create index idx_user_ips_ip on user_ips(ip_address);
create index idx_user_ips_user_id on user_ips(user_id);
