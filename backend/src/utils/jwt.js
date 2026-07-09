const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    let expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    if (/^\d+$/.test(expiresIn)) {
        expiresIn = `${expiresIn}d`;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
