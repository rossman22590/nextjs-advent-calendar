do $$
begin
  -- Add a default for session_token or drop the column since we already use token
  -- First check if session_token column exists
  if exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'session_token') then
    -- Drop the NOT NULL constraint from session_token
    begin
      execute 'alter table sessions alter column session_token drop not null';
    exception
      when undefined_object then
        null;
    end;
    
    -- Set all session_token values to null since we don't use this column
    update sessions set session_token = null where session_token is not null;
    
    -- Add a default of null
    begin
      execute 'alter table sessions alter column session_token set default null';
    exception
      when undefined_object then
        null;
    end;
  end if;
end$$;
