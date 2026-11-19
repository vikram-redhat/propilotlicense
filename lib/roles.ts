// Who is an admin. The flag lives in the user's app_metadata, which only the server (the
// service key) can set. Never read it from user_metadata: every user can edit their own
// user_metadata from the browser (supabase.auth.updateUser), so a check there lets anyone
// make themselves an admin. The database policies read the same app_metadata flag
// (scripts/security_fix_roles_and_paid_20261119.sql).
export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined): boolean {
  return user?.app_metadata?.is_admin === true
}
