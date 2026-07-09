/**
 * Generic Joi validation middleware factory.
 * Usage: router.post('/path', validate(schema), controller)
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: true,       // return first error only
        allowUnknown: false,    // reject unknown fields
        stripUnknown: true,     // remove unknown fields from value
    });

    if (error) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: error.details.map((d) => ({
                field: d.context.key || d.path.join('.'),
                message: d.message,
            })),
        });
    }

    // Replace req.body with sanitized value
    req.body = value;
    next();
};

module.exports = validate;
