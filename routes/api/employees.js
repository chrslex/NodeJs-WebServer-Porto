const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeeController');
const ROLES_LIST = require("../../config/roles_list").ROLES_LIST;
const verifyRoles = require("../../middleware/verifyRoles");

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.createNewEmployees)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee);
    
module.exports = {router};