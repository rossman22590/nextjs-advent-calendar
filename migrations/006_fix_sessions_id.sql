do $$
begin
  -- backfill id with token/session_token where missing
  update sessions
    set id = coalesce(id, token, session_token)
    where id is null;

  -- drop NOT NULL if present
  begin
    alter table sessions alter column id drop not null;
  exception
    when undefined_column then
      null;
  end;

  -- set a default to avoid future null inserts (simple pseudo-uuid)
  begin
    alter table sessions alter column id set default md5(random()::text);
  exception
    when undefined_column then
      null;
  end;
end$$;
