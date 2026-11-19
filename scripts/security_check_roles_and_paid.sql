-- Read-only: who is an admin, who has paid access, how each was set, and whether the two
-- holes (self-made admin, self-made paid) are open. Run before and after
-- security_fix_roles_and_paid_20261119.sql and paste the result back. Changes nothing.
--
-- Sections:
--   admin        every account with is_admin in user_metadata (editable by the user) or
--                app_metadata (server only), and where
--   admin-change auth log entries that changed those accounts (when, and by whom)
--   paid         every profile with a tier, plan or expiry (matched against Razorpay separately)
--   policy       any database policy still reading user_metadata (should be none after)
--   function     any function that checks admin from user_metadata (should be none)
--   grant        UPDATE privileges students hold on profiles (after: only safe columns)
SELECT * FROM (
  SELECT 'admin' AS section, u.email, u.created_at AS at,
         concat_ws(' · ',
           CASE WHEN u.raw_user_meta_data ? 'is_admin' THEN 'user_metadata.is_admin=' || (u.raw_user_meta_data->>'is_admin') END,
           CASE WHEN u.raw_app_meta_data ? 'is_admin' THEN 'app_metadata.is_admin=' || (u.raw_app_meta_data->>'is_admin') END,
           'last sign-in ' || coalesce(u.last_sign_in_at::text, 'never'),
           'providers ' || coalesce(u.raw_app_meta_data->>'providers', '')) AS detail
    FROM auth.users u
   WHERE u.raw_user_meta_data ? 'is_admin' OR u.raw_app_meta_data ? 'is_admin'

  UNION ALL
  SELECT 'admin-change', u.email, a.created_at,
         concat_ws(' · ', a.payload->>'action',
           'by ' || coalesce(a.payload->>'actor_username', a.payload->>'actor_id', '?'),
           CASE WHEN a.payload->>'actor_id' = u.id::text THEN 'the user themselves' ELSE 'someone else / server' END)
    FROM auth.audit_log_entries a
    JOIN auth.users u ON u.id::text IN (a.payload->>'actor_id', a.payload->'traits'->>'user_id')
   WHERE (u.raw_user_meta_data ? 'is_admin' OR u.raw_app_meta_data ? 'is_admin')
     AND a.payload->>'action' IN ('user_modified', 'user_updated', 'user_invited', 'user_signedup')

  UNION ALL
  SELECT 'paid', p.email, p.updated_at,
         concat_ws(' · ', 'tier ' || coalesce(p.subscription_tier, '-'), 'plan ' || coalesce(p.subscription_plan, '-'),
           'expires ' || coalesce(p.subscription_expires_at::text, '-'),
           CASE WHEN p.subscription_expires_at > now() THEN 'ACTIVE' ELSE 'expired' END)
    FROM public.profiles p
   WHERE p.subscription_tier IS DISTINCT FROM 'free' OR p.subscription_plan IS NOT NULL OR p.subscription_expires_at IS NOT NULL

  UNION ALL
  SELECT 'policy', tablename || ': ' || policyname, NULL, coalesce(qual, '') || coalesce(' / check ' || with_check, '')
    FROM pg_policies
   WHERE schemaname = 'public' AND (coalesce(qual, '') || coalesce(with_check, '')) ILIKE '%user_metadata%'

  UNION ALL
  SELECT 'function', p.proname, NULL, 'reads user_metadata'
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.prosrc ILIKE '%user_metadata%' AND p.prosrc ILIKE '%admin%'

  UNION ALL
  SELECT 'grant', grantee || ' on profiles', NULL, string_agg(column_name, ', ' ORDER BY column_name)
    FROM information_schema.column_privileges
   WHERE table_schema = 'public' AND table_name = 'profiles' AND privilege_type = 'UPDATE' AND grantee IN ('anon', 'authenticated')
   GROUP BY grantee
) r
ORDER BY section, at NULLS LAST;
