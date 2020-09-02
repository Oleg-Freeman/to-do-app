const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userName: {
    type: String,
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasks'
  }],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isAuthenticated: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
