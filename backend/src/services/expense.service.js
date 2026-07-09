const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const ApiError = require('../utils/ApiError');

/**
 * Add a new expense to a group.
 */
const addExpense = async (groupId, { paidBy, amount, description, splitAmong }, requesterId) => {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, 'Invalid group ID');
    }

    // Validate group exists
    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, 'Group not found');
    }

    const memberIds = group.members.map((m) => m.toString());

    // Requester must be a member
    if (!memberIds.includes(requesterId.toString())) {
        throw new ApiError(403, 'You are not a member of this group');
    }

    // Payer must be a member
    if (!memberIds.includes(paidBy)) {
        throw new ApiError(400, 'paidBy user is not a member of this group');
    }

    // All split users must be members
    const invalidUsers = splitAmong.filter((s) => !memberIds.includes(s.user));
    if (invalidUsers.length > 0) {
        throw new ApiError(400, 'One or more users in splitAmong are not group members');
    }

    // Split total must equal expense amount (allow small floating point tolerance)
    const splitTotal = splitAmong.reduce((sum, s) => sum + s.amount, 0);
    if (Math.abs(splitTotal - amount) > 0.01) {
        throw new ApiError(
            400,
            `Sum of split amounts (${splitTotal}) must equal the expense amount (${amount})`
        );
    }

    const expense = await Expense.create({
        groupId,
        paidBy,
        amount,
        description: description || '',
        splitAmong,
    });

    return expense;
};

/**
 * Get all expenses for a group (latest first). Membership check included.
 */
const getGroupExpenses = async (groupId, requesterId) => {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, 'Invalid group ID');
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, 'Group not found');
    }

    const memberIds = group.members.map((m) => m.toString());
    if (!memberIds.includes(requesterId.toString())) {
        throw new ApiError(403, 'You are not a member of this group');
    }

    const expenses = await Expense.find({ groupId })
        .populate('paidBy', 'name email')
        .populate('splitAmong.user', 'name email')
        .sort({ createdAt: -1 });

    return expenses;
};

module.exports = { addExpense, getGroupExpenses };
