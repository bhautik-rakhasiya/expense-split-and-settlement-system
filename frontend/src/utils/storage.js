import { STORAGE_KEYS } from './constants';

// ── Token ────────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

export const setToken = (token) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

export const removeToken = () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

// ── User ─────────────────────────────────────────────────────────────────────
export const getUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) =>
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

export const removeUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

// ── Clear All ─────────────────────────────────────────────────────────────────
export const clearAuth = () => {
  removeToken();
  removeUser();
};
