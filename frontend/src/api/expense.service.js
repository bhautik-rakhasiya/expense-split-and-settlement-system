import api from './axios';

/**
 * POST /api/groups/:groupId/expenses
 * Body: {
 *   paidBy: string,          — member _id
 *   amount: number,
 *   description: string,
 *   splitAmong: [{ user: string, amount: number }]  — user is member _id
 * }
 */
export const addExpense = (groupId, data) => api.post(`/groups/${groupId}/expenses`, data);

/**
 * GET /api/groups/:groupId/expenses
 * Returns list of expenses (latest first), populated paidBy + splitAmong.user
 */
export const getExpenses = (groupId) => api.get(`/groups/${groupId}/expenses`);

/**
 * GET /api/groups/:groupId/summary
 * Returns [{ userId, name, balance }]
 */
export const getSummary = (groupId) => api.get(`/groups/${groupId}/summary`);

/**
 * GET /api/groups/:groupId/settlements
 * Returns [{ from, fromId, to, toId, amount }]
 */
export const getSettlements = (groupId) => api.get(`/groups/${groupId}/settlements`);
