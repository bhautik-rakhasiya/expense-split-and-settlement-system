const expenseService = require('../services/expense.service');
const ApiResponse = require('../utils/ApiResponse');

const addExpense = async (req, res, next) => {
    try {
        const expense = await expenseService.addExpense(
            req.params.groupId,
            req.body,
            req.user._id
        );
        return res.status(201).json(new ApiResponse(201, 'Expense added successfully', { expense }));
    } catch (error) {
        next(error);
    }
};

const getGroupExpenses = async (req, res, next) => {
    try {
        const expenses = await expenseService.getGroupExpenses(
            req.params.groupId,
            req.user._id
        );
        return res.status(200).json(new ApiResponse(200, 'Expenses fetched successfully', { expenses }));
    } catch (error) {
        next(error);
    }
};

module.exports = { addExpense, getGroupExpenses };
