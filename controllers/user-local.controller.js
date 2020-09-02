const User = require('../models/user-local.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// .env config
require('dotenv').config({ path: './config/.env' });

const {
  registerValidation,
  loginValidation
} = require('../middlewares/validation');

// Get all users from local storage
exports.getAllUsers = (req, res) => {
  try {
    User.getAll(users => {
      if (!users || users.length === 0) {
        res.status(400).json('No any registered users found');
      }
      else {
        const orderedUsers = users.sort((a, b) => {
          if (a.createdAt > b.createdAt) return -1;
        });
        res.json(orderedUsers);
      }
    });
  }
  catch (err) {
    console.log('Error : ' + err);
    res.status(400).json('Error: ' + err);
  }
};

// Register new user
exports.registerNewUser = (req, res) => {
  const { email, password, userName } = req.body;

  // Validate data
  const { error } = registerValidation(req.body);

  if (error && error.details[0].path[0] === 'email') {
    res.status(400).json({
      email: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
    return;
  }
  if (error && error.details[0].path[0] === 'password') {
    res.status(400).json({
      password: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
    return;
  }
  if (error && error.details[0].path[0] === 'password2') {
    res.status(400).json({
      password2: 'Confirm password do not match',
      message: 'Wrong credentials, try again'
    });
    return;
  }
  if (error && error.details[0].path[0] === 'userName') {
    res.status(400).json({
      userName: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
    return;
  }

  try {
    // Check if User Exists in DB
    User.getAll(async(users) => {
      if (users && users.length !== 0) {
        const emailExist = users.find(user => user.email === req.body.email);
        if (emailExist) {
          res.status(400).json({ message: 'Email is already exists' });
          return;
        }
      }

      const isAdmin = !!req.body.isAdmin;
      const newUser = new User(email, password, userName, isAdmin);

      // Hash password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(req.body.password, salt);

      newUser.save();
      res.status(200).json(newUser);
    });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Login
exports.userLogIn = (req, res) => {
  const { error } = loginValidation(req.body);
  if (error && error.details[0].path[0] === 'email') {
    return res.status(400).json({
      email: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  if (error && error.details[0].path[0] === 'password') {
    return res.status(400).json({
      password: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  try {
    User.getAll(users => {
      if (users && users.length !== 0) {
        const user = users.find(u => u.email === req.body.email);

        if (!user) {
          res.status(400).json('Wrong credentials, try again');
        }
        else if (user.isAuthenticated === true) {
          res.json({
            userId: user._id,
            token: req.header.token
          });
        }
        else {
          // Match password
          bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
              res.status(400).json('Error: ' + err);
              return err;
            }
            if (isMatch) {
              user.isAuthenticated = true;

              const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
              User.update(user);
              res.json({
                userId: user._id,
                token: token,
                isAdmin: user.isAdmin
              });
            }
            else {
              console.log('Wrong credentials, try again...');
              res.status(400).json('Wrong credentials, try again...');
            }
          });
        }
      }
      else res.status(400).json('No users found...');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Logout
exports.userlogOut = (req, res) => {
  try {
    User.getAll(users => {
      if (users && users.length !== 0) {
        const user = users.find(u => u._id === +req.params.id);
        if (!user) {
          res.status(400).json('User not found');
        }
        else if (user.isAuthenticated === false) {
          res.json({ notAuthenticated: true });
        }
        else {
          user.isAuthenticated = false;
          User.update(user);
          res.json({ loggedOut: true });
        }
      }
      else res.status(400).json('User not found');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Get one user by ID
exports.getOneUser = (req, res) => {
  try {
    User.getAll(users => {
      if (users && users.length !== 0) {
        const user = users.find(u => u._id === +req.params.id);
        if (!user) {
          res.status(400).json('Error: user not found');
        }
        else {
          res.json(user);
        }
      }
      else res.status(400).json('No users found');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Delete user
exports.deleteuser = (req, res) => {
  try {
    User.delete(req.params.id);
    res.status(200).json('User deleted');
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};
