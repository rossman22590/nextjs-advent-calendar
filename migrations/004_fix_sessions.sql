do $$
declare
  has_token boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_name = 'sessions'
      and column_name = 'token'
  ) into has_token;

  if not has_token then
    -- add column without PK
    alter table sessions add column token text;
  end if;

  -- ensure a PK on token (drop existing PK if different)
  begin
    execute 'alter table sessions drop constraint sessions_pkey';
  exception
    when undefined_object then
      null;
  end;

  begin
    execute 'alter table sessions add constraint sessions_pkey primary key (token)';
  exception
    when duplicate_table then
      null;
  end;
end$$;
