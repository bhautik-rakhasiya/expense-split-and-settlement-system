const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Calculate per-user balances for a group.
 * Balance = total paid - total owed
 * Positive → creditor (others owe them)
 * Negative → debtor (they owe others)
 */
const calculateSummary = async (groupId, requesterId) => {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, 'Invalid group ID');
    }

    const group = await Group.findById(groupId).populate('members', 'name email');
    if (!group) {
        throw new ApiError(404, 'Group not found');
    }

    const memberIds = group.members.map((m) => m._id.toString());
    if (!memberIds.includes(requesterId.toString())) {
        throw new ApiError(403, 'You are not a member of this group');
    }

    // Initialize balance map for every member
    const balanceMap = {};
    group.members.forEach((m) => {
        balanceMap[m._id.toString()] = { userId: m._id, name: m.name, balance: 0 };
    });

    const expenses = await Expense.find({ groupId });

    for (const expense of expenses) {
        const paidById = expense.paidBy.toString();

        // Payer gets credited the full amount
        if (balanceMap[paidById]) {
            balanceMap[paidById].balance += expense.amount;
        }

        // Each split user is debited their share
        for (const split of expense.splitAmong) {
            const splitUserId = split.user.toString();
            if (balanceMap[splitUserId]) {
                balanceMap[splitUserId].balance -= split.amount;
            }
        }
    }

    return Object.values(balanceMap);
};

/**
 * Greedy minimum-transaction settlement algorithm.
 * Matches largest creditor with largest debtor iteratively.
 */
const calculateSettlements = async (groupId, requesterId) => {
    const summary = await calculateSummary(groupId, requesterId);

    // Build mutable creditor/debtor lists
    const creditors = summary
        .filter((s) => s.balance > 0.005)
        .map((s) => ({ ...s, balance: Math.round(s.balance * 100) / 100 }))
        .sort((a, b) => b.balance - a.balance);

    const debtors = summary
        .filter((s) => s.balance < -0.005)
        .map((s) => ({ ...s, balance: Math.round(Math.abs(s.balance) * 100) / 100 }))
        .sort((a, b) => b.balance - a.balance);

    const settlements = [];

    while (creditors.length > 0 && debtors.length > 0) {
        const creditor = creditors[0];
        const debtor = debtors[0];

        const amount = Math.min(creditor.balance, debtor.balance);
        const roundedAmount = Math.round(amount * 100) / 100;

        if (roundedAmount > 0) {
            settlements.push({
                from: debtor.name,
                fromId: debtor.userId,
                to: creditor.name,
                toId: creditor.userId,
                amount: roundedAmount,
            });
        }

        creditor.balance -= amount;
        debtor.balance -= amount;

        if (creditor.balance < 0.005) creditors.shift();
        if (debtor.balance < 0.005) debtors.shift();
    }

    return settlements;
};

module.exports = { calculateSummary, calculateSettlements };
