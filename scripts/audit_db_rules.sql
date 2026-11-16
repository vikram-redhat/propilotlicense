-- Read-only: every check/unique/foreign-key constraint, trigger and RLS policy on the main
-- tables, as the database actually has them, to compare with the repo's migrations.
-- Changes nothing. Run in the Supabase SQL editor and paste the result back.
WITH t AS (
  SELECT c.oid, c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname IN ('sessions', 'questions', 'session_answers', 'profiles')
)
SELECT t.relname AS table_name, 'constraint' AS kind, con.conname AS name, pg_get_constraintdef(con.oid) AS definition
  FROM pg_constraint con JOIN t ON t.oid = con.conrelid
  WHERE con.contype IN ('c', 'u', 'f', 'x')
UNION ALL
SELECT t.relname, 'trigger', tg.tgname, pg_get_triggerdef(tg.oid)
  FROM pg_trigger tg JOIN t ON t.oid = tg.tgrelid
  WHERE NOT tg.tgisinternal
UNION ALL
SELECT p.tablename, 'policy', p.policyname,
       p.cmd || ' to ' || array_to_string(p.roles, ',') ||
       coalesce(' using (' || p.qual || ')', '') || coalesce(' with check (' || p.with_check || ')', '')
  FROM pg_policies p
  WHERE p.schemaname = 'public' AND p.tablename IN ('sessions', 'questions', 'session_answers', 'profiles')
UNION ALL
SELECT t.relname, 'rls', CASE WHEN c.relrowsecurity THEN 'enabled' ELSE 'DISABLED' END, ''
  FROM pg_class c JOIN t ON t.oid = c.oid
UNION ALL
-- Triggers on auth.users that write to these tables (e.g. profile creation)
SELECT 'auth.users', 'trigger', tg.tgname, pg_get_triggerdef(tg.oid)
  FROM pg_trigger tg JOIN pg_class c ON c.oid = tg.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'auth' AND c.relname = 'users' AND NOT tg.tgisinternal
ORDER BY 1, 2, 3;
