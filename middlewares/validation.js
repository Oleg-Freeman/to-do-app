const Joi = require('@hapi/joi');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// .env config
require('dotenv').config({ path: './config/.env' });

module.exports = {

  registerValidation: (data) => {
    const schema = Joi.object({
      email: Joi.string().required().min(6).max(254).email().lowercase(),
      password: Joi.string().min(6).max(72, 'utf8').required(),
      password2: Joi.any().valid(Joi.ref('password')).required(),
      userName: Joi.string().min(3).max(128).required()
    });
    return schema.validate(data);
  },

  loginValidation: (data) => {
    const schema = Joi.object({
      email: Joi.string().required().min(6).max(254).email().lowercase(),
      password: Joi.string().min(6).max(72, 'utf8').required()
    });
    return schema.validate(data);
  },

  ensureAuthenticated: async(req, res, next) => {
    if (!req.headers.token) {
      console.log('Please log in to view that resource');
      return res.status(401).json('Please log in to view that resource');
    }
    else {
      try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);

        await User.findById(decoded.userId)
          .exec((err, user) => {
            if (err) {
              res.status(401).json('Error: ' + err);
              return err;
            }
            else if (user === null || user.length === 0) {
              return res.status(401).json('User not found');
            }
            else if (!user.isAuthenticated) {
              console.log('Please log in to view that resource');
              return res.status(401).json('Please log in to view that resource');
            }
            else {
              req.user = user;
              next();
            }
          });
      }
      catch (e) {
        if (e) return res.status(401).json('Auth error: ' + e);
      }
    }
  },

  isloggedIn: async(req, res, next) => {
    if (req.headers.token) {
      try {
        // const token = req.headers.token.split(' ')[1];
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);

        await User.findById(decoded.userId)
          .exec((err, user) => {
            if (err) return res.status(400).json('Error: ' + err);
            if (user.isAuthenticated) {
              console.log('User already logged in');
              return res.json({ authenticated: true });
            }
            else {
              next();
            }
          });
      }
      catch (e) {
        if (e) return res.status(400).json('Error: ' + e);
      }
    }
    else {
      next();
    }
  },

  isNotloggedIn: (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) {
      console.log('User not logged in');
      return res.json({ notAuthenticated: true });
    }
    else {
      next();
    }
  },

  bodyValidation: (data) => {
    const schema = Joi.object({
      body: Joi.string().empty().not(' ')
    });
    return schema.validate(data);
  }

};
