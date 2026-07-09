import api from './axios';

/**
 * GET /api/users/search?email=xxx
 * Returns { user: { _id, name, email } }
 */
export const searchUserByEmail = (email) =>
  api.get('/users/search', { params: { email } });

/**
 * GET /api/users?search=xxx
 * Returns { users: [{ _id, name, email }] }
 */
export const getUsers = (search) =>
  api.get('/users', { params: { search } });
