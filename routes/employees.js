const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
	addEmployee,
	getAllEmployees,
	getEmployeeById,
	removeEmployee,
	editEmployee,
} = require('../controllers/employees');

router.get('/', auth, getAllEmployees);
router.get('/:id', auth, getEmployeeById);
router.post('/add', auth, addEmployee);
router.post('/remove/:id', auth, removeEmployee);
router.put('/edit/:id', auth, editEmployee);

module.exports = router;
