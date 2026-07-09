const settlementService = require('../services/settlement.service');
const ApiResponse = require('../utils/ApiResponse');

const getGroupSummary = async (req, res, next) => {
    try {
        const summary = await settlementService.calculateSummary(
            req.params.groupId,
            req.user._id
        );
        return res.status(200).json(new ApiResponse(200, 'Summary fetched successfully', summary));
    } catch (error) {
        next(error);
    }
};

const getSettlements = async (req, res, next) => {
    try {
        const settlements = await settlementService.calculateSettlements(
            req.params.groupId,
            req.user._id
        );
        return res.status(200).json(
            new ApiResponse(200, 'Settlement suggestions fetched successfully', settlements)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { getGroupSummary, getSettlements };
