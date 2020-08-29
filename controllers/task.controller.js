const Task = require('../models/task.model');

// Validations
const { bodyValidation } = require('../middlewares/validation');

// Get all Tasks from user
exports.getAllUserTasks = async(req, res) => {
  try {
    let allTasks = [];
    const tasks1 = await Task.find({ userId: req.user._id, completed: false })
      .sort({ createdAt: -1 });
    const tasks2 = await Task.find({ userId: req.user._id, completed: true })
      .sort({ createdAt: -1 });
    allTasks = [...tasks1, ...tasks2];
    res.status(200).json(allTasks);
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Add new Task
exports.addNewTask = async(req, res) => {
  try {
    const { error } = bodyValidation(req.body);
    if (error) {
      res.status(400).json({ bodyValidationError: error.details[0].message });
      return;
    }
    else {
      const userName = req.user.userName;
      const body = req.body.body;
      const userId = req.user._id;

      const newTask = new Task({
        userName,
        body,
        userId
      });

      await newTask.save(() => {
        res.status(200).json(newTask);
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Delete one Task
exports.deleteOnetask = async(req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id, (err, task) => {
      if (err) {
        res.status(400).json('Error: ' + err);
        return err;
      }
      else if (task === null) res.status(400).json('Task not found');
      else if (task.userId !== req.user._id.toString()) {
        res.status(401).json('Unauthorized, trying to reach private data...');
      }
      else {
        res.json('Task deleted');
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Update Task
exports.updateTask = async(req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task === null) {
      res.status(400).json('Task not found');
      return;
    }
    else if (task.userId !== req.user._id.toString()) {
      res.status(401).json('Unauthorized, trying to reach private data...');
      return;
    }
    else {
      const { error } = bodyValidation(req.body);
      if (error) {
        res.status(400).json(error.details[0].message);
        return;
      }

      task.body = req.body.body;

      await task.save(() => {
        res.json('Task updated!');
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};

// Mark as complete
exports.markAsCompleted = async(req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task === null) {
      res.status(400).json('Task not found');
      return;
    }
    else if (task.userId !== req.user._id.toString()) {
      res.status(401).json('Unauthorized, trying to reach private data...');
      return;
    }
    else {
      if (task.completed === false) {
        task.completed = true;
        await task.save(() => {
          res.status(200).json('Completed!');
        });
      }
      else {
        task.completed = false;
        await task.save(() => {
          res.status(200).json('Not completed...');
        });
      }
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Error: ' + err);
  }
};