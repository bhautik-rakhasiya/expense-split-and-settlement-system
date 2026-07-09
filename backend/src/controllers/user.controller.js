const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Search a user by exact email address.
 */
const searchByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        if (!email) {
            return next(new ApiError(400, 'Query parameter "email" is required'));
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('_id name email');
        if (!user) {
            return next(new ApiError(404, `No user found with email: ${email}`));
        }

        return res.status(200).json(new ApiResponse(200, 'User found', { user }));
    } catch (error) {
        next(error);
    }
};

/**
 * Get users list. Can be filtered by query param `search` (searches name or email).
 * Excludes currently logged-in user.
 */
const getUsers = async (req, res, next) => {
    try {
        const { search } = req.query;
        const currentUserId = req.user._id;

        const query = {
            _id: { $ne: currentUserId }
        };

        if (search) {
            const cleanSearch = search.trim();
            query.$or = [
                { name: { $regex: cleanSearch, $options: 'i' } },
                { email: { $regex: cleanSearch, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('_id name email').limit(50);
        return res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', { users }));
    } catch (error) {
        next(error);
    }
};

module.exports = { searchByEmail, getUsers };
