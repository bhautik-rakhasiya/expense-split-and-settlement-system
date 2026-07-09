import api from './axios';

/**
 * GET /api/groups
 * Returns all groups where the authenticated user is a member.
 */
export const getGroups = () => api.get('/groups');

/**
 * POST /api/groups
 * Body: { name: string, members: string[] }  — members is array of _id strings
 */
export const createGroup = (data) => api.post('/groups', data);

/**
 * GET /api/groups/:groupId
 * Returns group + populated members + totalExpenses count.
 */
export const getGroupById = (groupId) => api.get(`/groups/${groupId}`);
