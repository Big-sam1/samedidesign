export const ADMIN_EMAIL = 'samedidesign@gmail.com';
export const ADMIN_PASSWORD = '123456';
export const ADMIN_SESSION_KEY = 'samedidesign.admin.session';

export function hasAdminSession(): boolean {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}