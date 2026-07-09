const Joi = require('joi');

const objectId = Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .message('Must be a valid MongoDB ObjectId');

const addExpenseSchema = Joi.object({
    paidBy: objectId.required().messages({
        'any.required': 'paidBy is required',
    }),
    amount: Joi.number().positive().required().messages({
        'number.positive': 'Amount must be greater than 0',
        'any.required': 'Amount is required',
    }),
    description: Joi.string().trim().allow('').optional(),
    splitAmong: Joi.array()
        .items(
            Joi.object({
                user: objectId.required().messages({
                    'any.required': 'User ID in splitAmong is required',
                }),
                amount: Joi.number().positive().required().messages({
                    'number.positive': 'Split amount must be greater than 0',
                    'any.required': 'Split amount is required',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'splitAmong must have at least 1 member',
            'any.required': 'splitAmong is required',
        }),
});

module.exports = { addExpenseSchema };
