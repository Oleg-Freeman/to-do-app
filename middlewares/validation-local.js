const User = require('../models/user-local.model');
const jwt = require('jsonwebtoken');

// .env config
require('dotenv').config({ path: './config/.env' });

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.token) {
    res.status(401).json('Please log in to view that resource');
  }
  else {
    try {
      const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);

      User.getAll(users => {
        if (users) {
          const user = users.find(user => user._id === decoded.userId);
          if (!user) {
            res.status(401).json('User not found');
          }
          else {
            if (!user.isAuthenticated) {
              res.status(401).json('Please log in to view that resource');
            }
            else {
              // console.log(user);
              req.user = user;
              next();
            }
          }
        }
        else res.status(401).json('No users found');
      });
    }
    catch (e) {
      if (e) {
        console.log(e);
        res.status(401).json('Auth error: ' + e);
      }
    }
  }
};

exports.isloggedIn = (req, res, next) => {
  if (req.headers.token) {
    try {
      const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);

      User.getAll(users => {
        if (users) {
          const user = users.find(user => user._id === decoded.userId);
          if (!user) {
            res.status(401).json('User not found');
          }
          else {
            if (user.isAuthenticated) {
              console.log('User already logged in');
              res.json({ authenticated: true });
            }
            else {
              next();
            }
          }
        }
        else res.status(401).json('No users found');
      });
    }
    catch (e) {
      if (e) {
        console.log('Error: ' + e);
        res.status(400).json('Error: ' + e);
      }
    }
  }
  else {
    next();
  }
};
