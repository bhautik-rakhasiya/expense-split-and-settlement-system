const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');
const { searchByEmail, getUsers } = require('../controllers/user.controller');

// All user routes are protected
router.use(authenticate);

// GET /api/users (search/list)
router.get('/', getUsers);

// GET /api/users/search?email=xxx
router.get('/search', searchByEmail);

module.exports = router;
