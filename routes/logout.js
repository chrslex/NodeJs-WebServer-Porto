const express = require('express');
const router = express.Router();
const logOutController = require('../controllers/logoutController');

router.route('/')
    .post(logOutController.handleLogout);

module.exports = {router};