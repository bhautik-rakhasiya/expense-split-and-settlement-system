const mongoose = require('mongoose');
const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ApiError = require('../utils/ApiError');

/**
 * Create a new group.
 * Creator is automatically added as a member.
 */
const createGroup = async ({ name, members }, creatorId) => {
    // Ensure creator is included in members (deduplicate)
    const creatorStr = creatorId.toString();
    const uniqueMembers = [...new Set([creatorStr, ...members])];

    // Validate that all member IDs exist in DB
    const users = await User.find({ _id: { $in: uniqueMembers } });
    if (users.length !== uniqueMembers.length) {
        throw new ApiError(400, 'One or more member IDs do not exist');
    }

    // Minimum 2 members required (including creator)
    if (uniqueMembers.length < 2) {
        throw new ApiError(400, 'A group must have at least 2 members');
    }

    const group = await Group.create({
        name,
        members: uniqueMembers,
        createdBy: creatorId,
    });

    return group;
};

/**
 * Get all groups the authenticated user belongs to.
 */
const getUserGroups = async (userId) => {
    const groups = await Group.find({ members: userId })
        .populate('members', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    return groups;
};

/**
 * Get a single group by ID. Enforces membership check.
 */
const getGroupById = async (groupId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, 'Invalid group ID');
    }

    const group = await Group.findById(groupId)
        .populate('members', 'name email')
        .populate('createdBy', 'name email');

    if (!group) {
        throw new ApiError(404, 'Group not found');
    }

    // Only members can access this group
    const isMember = group.members.some((m) => m._id.toString() === userId.toString());
    if (!isMember) {
        throw new ApiError(403, 'You are not a member of this group');
    }

    // Attach total expense count
    const totalExpenses = await Expense.countDocuments({ groupId });

    return { ...group.toObject(), totalExpenses };
};

module.exports = { createGroup, getUserGroups, getGroupById };
