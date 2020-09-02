const router = require('express').Router();

// .env config
require('dotenv').config({ path: './config/.env' });

let validationPathName = '';
let pathName = '';
switch (process.env.STORE_LOCALLY) {
  case 'false':
    pathName = '../controllers/task.controller';
    validationPathName = '../middlewares/validation.js';
    break;
  case 'true':
    validationPathName = '../middlewares/validation-local.js';
    pathName = '../controllers/task-local.controller.js';
    break;
  default:
    validationPathName = '../middlewares/validation.js';
    pathName = '../controllers/task.controller';
}

// Task controllers
const {
  getAllUserTasks,
  addNewTask,
  deleteOnetask,
  updateTask,
  markAsCompleted,
  adminGetAllTasks
} = require(pathName);

// Validations
const { ensureAuthenticated } = require(validationPathName);
const { isAdmin } = require('../middlewares/validation.js');

// Get all Tasks from user
router.route('/').get(ensureAuthenticated, getAllUserTasks);

// Admin - Get all Tasks from storage
router.route('/admin').get(ensureAuthenticated, isAdmin, adminGetAllTasks);

// Add new Task
router.route('/add').post(ensureAuthenticated, addNewTask);

// Delete one Task
router.route('/:id').delete(ensureAuthenticated, deleteOnetask);

// Update Task
router.route('/update/:id').post(ensureAuthenticated, updateTask);

// Mark as complete
router.route('/complete/:id').get(ensureAuthenticated, markAsCompleted);

module.exports = router;
