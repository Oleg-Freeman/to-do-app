const Task = require('../models/task-local.model');

// Validations
const { bodyValidation } = require('../middlewares/validation');

// Get all Tasks from user
exports.getAllUserTasks = (req, res) => {
  try {
    Task.getAll(tasks => {
      if (tasks && tasks.length !== 0) {
        const tasks1 = tasks.filter(task => +task.userId === +req.user._id)
          .filter(task => task.completed === false)
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
          });
        const tasks2 = tasks.filter(task => +task.userId === +req.user._id)
          .filter(task => task.completed === true)
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
          });
        const userTasks = [...tasks1, ...tasks2];
        res.status(200).json(userTasks);
      }
      else res.status(400).json('No tasks found');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Admin -  Get all Tasks from storage
exports.adminGetAllTasks = (req, res) => {
  try {
    Task.getAll(tasks => {
      if (tasks && tasks.length !== 0) {
        const tasks1 = tasks
          .filter(task => task.completed === false)
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
          });
        const tasks2 = tasks
          .filter(task => task.completed === true)
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
          });
        const userTasks = [...tasks1, ...tasks2];
        res.status(200).json(userTasks);
      }
      else res.status(400).json('No tasks found');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Add new Task
exports.addNewTask = (req, res) => {
  try {
    const { error } = bodyValidation(req.body);
    if (error) {
      console.log(error);
      res.status(400).json({ bodyValidationError: error.details[0].message });
      return;
    }
    else {
      const userName = req.user.userName;
      const body = req.body.body;
      const userId = req.user._id;

      const newTask = new Task(
        userName,
        userId,
        body
      );

      newTask.save();
      res.status(200).json(newTask);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Delete one Task
exports.deleteOnetask = (req, res) => {
  try {
    Task.getAll(tasks => {
      if (tasks && tasks.length !== 0) {
        const task = tasks.find(t => t._id === +req.params.id);
        if (task.userId === req.user._id || req.user.isAdmin) {
          Task.delete(req.params.id);
          res.json('Task deleted');
        }
        else {
          res.status(401).json('Unauthorized, trying to reach private data...');
        }
      }
      else res.status(400).json('No tasks found');
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Update Task
exports.updateTask = (req, res) => {
  try {
    Task.getAll(tasks => {
      if (tasks && tasks.length !== 0) {
        const task = tasks.find(t => t._id === +req.params.id);
        if (!task) {
          res.status(400).json('Task not found');
        }
        else if (task.userId === req.user._id || req.user.isAdmin) {
          const { error } = bodyValidation(req.body);
          if (error) {
            res.status(400).json(error.details[0].message);
            return;
          }

          task.body = req.body.body;
          Task.update(task);
          res.status(200).json(task);
        }
        else {
          res.status(401).json('Unauthorized, trying to reach private data...');
        }
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Mark as complete
exports.markAsCompleted = (req, res) => {
  try {
    Task.getAll(tasks => {
      if (tasks && tasks.length !== 0) {
        const task = tasks.find(t => t._id === +req.params.id);
        if (!task) {
          res.status(400).json('Task not found');
        }
        else if (task.userId === req.user._id || req.user.isAdmin) {
          if (task.completed === false) {
            task.completed = true;
            Task.update(task);
            res.status(200).json({
              completed: true,
              taskId: task._id
            });
          }
          else {
            task.completed = false;
            Task.update(task);
            res.status(200).json({
              completed: false,
              taskId: task._id
            });
          }
        }
        else {
          res.status(401).json('Unauthorized, trying to reach private data...');
        }
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};
