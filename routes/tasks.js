const router = require('express').Router();

// Task controllers
const {
  getAllUserTasks,
  addNewTask,
  deleteOnetask,
  updateTask,
  markAsCompleted
} = require('../controllers/task.controller');

// Validations
const { ensureAuthenticated } = require('../middlewares/validation');

// Get all Tasks from user
router.route('/').get(ensureAuthenticated, getAllUserTasks);

// Add new Task
router.route('/add').post(ensureAuthenticated, addNewTask);

// Delete one Task
router.route('/:id').delete(ensureAuthenticated, deleteOnetask);

// Update Task
router.route('/update/:id').post(ensureAuthenticated, updateTask);

// Mark as complete
router.route('/complete/:id').get(ensureAuthenticated, markAsCompleted);

module.exports = router;
