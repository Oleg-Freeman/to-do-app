const router = require('express').Router();

let validationPathName = '';
let pathName = '';
switch (process.env.STORE_LOCALLY) {
  case 'false':
    pathName = '../controllers/user.controller.js';
    validationPathName = '../middlewares/validation.js';
    break;
  case 'true':
    validationPathName = '../middlewares/validation-local.js';
    pathName = '../controllers/user-local.controller.js';
    break;
  default:
    validationPathName = '../middlewares/validation.js';
    pathName = '../controllers/user.controller.js';
}

// User controllers
const {
  getAllUsers,
  registerNewUser,
  userLogIn,
  userlogOut,
  getOneUser,
  deleteuser
} = require(pathName);

// Validations
const {
  ensureAuthenticated,
  isloggedIn
} = require(validationPathName);

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
