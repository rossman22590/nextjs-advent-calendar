do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_name = 'users'
      and column_name = 'password_hash'
  ) then
    alter table users add column password_hash text;
  end if;
end$$;
