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
  registerNewUser,
  userLogIn,
  userlogOut,
  deleteuser
} = require(pathName);

// Validations
const {
  ensureAuthenticated,
  isloggedIn
} = require(validationPathName);
const { isAdmin } = require('../middlewares/validation.js');

// Register new user
router.route('/register').post(isloggedIn, registerNewUser);

// Login
router.route('/login').post(isloggedIn, userLogIn);

// Logout
router.route('/logout/:id').get(userlogOut);

// Delete user
router.route('/:id').delete(ensureAuthenticated, isAdmin, deleteuser);

module.exports = router;
