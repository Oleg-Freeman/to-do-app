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
  adminDeleteAnytask
} = require(pathName);

// Validations
const { ensureAuthenticated } = require(validationPathName);

// Get all Tasks from user
router.route('/').get(ensureAuthenticated, getAllUserTasks);

// Add new Task
router.route('/add').post(ensureAuthenticated, addNewTask);

// Delete one Task
router.route('/:id').delete(ensureAuthenticated, deleteOnetask);

// Admin -  Delete any Task
router.route('/admin/:id').delete(ensureAuthenticated, adminDeleteAnytask);

// Update Task
router.route('/update/:id').post(ensureAuthenticated, updateTask);

// Mark as complete
router.route('/complete/:id').get(ensureAuthenticated, markAsCompleted);

module.exports = router;
