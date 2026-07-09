const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(new ApiResponse(201, 'User registered successfully', result));
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return res.status(200).json(new ApiResponse(200, 'Login successful', result));
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
