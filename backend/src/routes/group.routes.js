const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const { createGroupSchema } = require('../validators/group.validator');
const { addExpenseSchema } = require('../validators/expense.validator');

const { createGroup, getUserGroups, getGroupById } = require('../controllers/group.controller');
const { addExpense, getGroupExpenses } = require('../controllers/expense.controller');
const { getGroupSummary, getSettlements } = require('../controllers/settlement.controller');

// All group routes are protected
router.use(authenticate);

// Group CRUD
router.post('/', validate(createGroupSchema), createGroup);
router.get('/', getUserGroups);
router.get('/:groupId', getGroupById);

// Expense routes (nested under group)
router.post('/:groupId/expenses', validate(addExpenseSchema), addExpense);
router.get('/:groupId/expenses', getGroupExpenses);

// Summary & Settlement routes
router.get('/:groupId/summary', getGroupSummary);
router.get('/:groupId/settlements', getSettlements);

module.exports = router;
