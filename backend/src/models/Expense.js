const mongoose = require('mongoose');

const SplitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Split amount must be greater than 0'],
        },
    },
    { _id: false }
);

const ExpenseSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: [true, 'Group ID is required'],
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Payer is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        splitAmong: {
            type: [SplitSchema],
            validate: {
                validator: (arr) => arr.length >= 1,
                message: 'splitAmong must have at least 1 member',
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
