// Authentication is handled by Supabase Auth in the admin login.

export const ADMIN_SESSION_KEY = 'samedidesign.admin.session';

export function hasAdminSession(): boolean {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}