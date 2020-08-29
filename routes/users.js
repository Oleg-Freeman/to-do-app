const router = require('express').Router();

// User controllers
const {
  getAllUsers,
  registerNewUser,
  userLogIn,
  userlogOut,
  getOneUser,
  deleteuser
} = require('../controllers/user.controller');

// Validations
const {
  ensureAuthenticated,
  isloggedIn
} = require('../middlewares/validation');

// Get all users from DB
router.route('/').get(getAllUsers);

// Register new user
router.route('/register').post(isloggedIn, registerNewUser);

// Login
router.route('/login').post(isloggedIn, userLogIn);

// Logout
router.route('/logout/:id').get(userlogOut);

// Get one user by ID
router.route('/:id').get(getOneUser);

// Delete user
router.route('/:id').delete(ensureAuthenticated, deleteuser);

module.exports = router;
