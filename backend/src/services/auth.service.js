const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        throw new ApiError(409, 'Email is already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Save user
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

    // Generate token
    const token = generateToken({ id: user._id });

    return {
        user: { id: user._id, name: user.name, email: user.email },
        token,
    };
};

/**
 * Login an existing user
 */
const login = async ({ email, password }) => {
    // Find user (include passwordHash for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({ id: user._id });

    return {
        token,
        user: { id: user._id, name: user.name, email: user.email },
    };
};

module.exports = { register, login };
