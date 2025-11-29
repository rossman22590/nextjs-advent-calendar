do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_name = 'sessions'
      and column_name = 'expires_at'
  ) then
    alter table sessions add column expires_at timestamptz;
  end if;
end$$;
