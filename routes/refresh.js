const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshTokenController');

router.route('/')
    .get(refreshController.handleRefreshToken);

module.exports = { router };