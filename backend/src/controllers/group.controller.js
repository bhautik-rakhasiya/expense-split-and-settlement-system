const groupService = require('../services/group.service');
const ApiResponse = require('../utils/ApiResponse');

const createGroup = async (req, res, next) => {
    try {
        const group = await groupService.createGroup(req.body, req.user._id);
        return res.status(201).json(new ApiResponse(201, 'Group created successfully', { group }));
    } catch (error) {
        next(error);
    }
};

const getUserGroups = async (req, res, next) => {
    try {
        const groups = await groupService.getUserGroups(req.user._id);
        return res.status(200).json(new ApiResponse(200, 'Groups fetched successfully', { groups }));
    } catch (error) {
        next(error);
    }
};

const getGroupById = async (req, res, next) => {
    try {
        const group = await groupService.getGroupById(req.params.groupId, req.user._id);
        return res.status(200).json(new ApiResponse(200, 'Group fetched successfully', { group }));
    } catch (error) {
        next(error);
    }
};

module.exports = { createGroup, getUserGroups, getGroupById };
