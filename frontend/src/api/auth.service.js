import api from './axios';

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Returns: { user: { _id, name, email }, token }
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { _id, name, email } }
 */
export const login = (data) => api.post('/auth/login', data);
