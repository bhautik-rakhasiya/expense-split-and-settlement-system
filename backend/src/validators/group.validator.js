const Joi = require('joi');

const objectId = Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .message('Must be a valid MongoDB ObjectId');

const createGroupSchema = Joi.object({
    name: Joi.string().trim().min(1).required().messages({
        'any.required': 'Group name is required',
        'string.empty': 'Group name cannot be empty',
    }),
    members: Joi.array()
        .items(objectId)
        .min(1)
        .unique()
        .required()
        .messages({
            'any.required': 'Members array is required',
            'array.min': 'At least one other member is required',
            'array.unique': 'Duplicate member IDs are not allowed',
        }),
});

module.exports = { createGroupSchema };
