const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// .env config
require('dotenv').config({ path: './config/.env' });

const {
  registerValidation,
  loginValidation
} = require('../middlewares/validation');

// Get all users from DB
exports.getAllUsers = async(req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });
    if (users === null || users.length === 0) {
      res.status(400).json('No any registered users found');
    }
    else res.json(users);
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Register new user
exports.registerNewUser = async(req, res) => {
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
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      res.status(400).json({ message: 'Email is already exists' });
      return;
    }

    const newUser = new User({ email, password, userName });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt);

    await newUser.save(() => res.status(200).json(newUser));
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
    console.log(err);
  }
};

// Login
exports.userLogIn = async(req, res) => {
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
    const user = await User.findOne({ email: req.body.email });
    if (user === null || user.length === 0) {
      res.status(400).json('Wrong credentials, try again');
      return;
    }
    else if (user.isAuthenticated === true) {
      res.json({
        userId: user._id,
        token: req.header.token
      });
      return;
    }
    else {
      // Match password
      await bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
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
          user.save(() => {
            res.json({
              userId: user._id,
              token: token
            });
          });
        }
        else {
          console.log('Wrong credentials, try again...');
          res.status(400).json('Wrong credentials, try again...');
        }
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Logout
exports.userlogOut = async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null || user.length === 0) {
      res.status(400).json('User not found');
      return;
    }
    else if (user.isAuthenticated === false) {
      res.json({ notAuthenticated: true });
      return;
    }
    else {
      user.isAuthenticated = false;
      await user.save(() => {
        res.json({ loggedOut: true });
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Get one user by ID
exports.getOneUser = async(req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (user === null) {
      res.status(400).json('Error: user not found');
    }
    else {
      res.json(user);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Delete user
exports.deleteuser = async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id, (err, user) => {
      if (err) {
        res.status(400).json('Error: ' + err);
        return err;
      }
      else if (user === null) res.status(400).json('Error: user not found');
      else res.json('User deleted');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};
