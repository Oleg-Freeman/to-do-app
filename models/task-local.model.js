const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'tasks.json');

const getTasksFromFile = (cb) => {
  fs.readFile(p, (err, content) => {
    if (err) {
      return cb([]);
    }
    else {
      cb(JSON.parse(content));
    }
  });
};

class Task {
  constructor(userName = '', userId = 0, body = '') {
    this.userName = userName;
    this.userId = userId;
    this.body = body;
    this.completed = false;
    this.createdAt = new Date();
    this._id = Date.now();
  }

  save() {
    getTasksFromFile(tasks => {
      tasks.push(this);
      fs.writeFile(p, JSON.stringify(tasks), err => {
        if (err) console.log('Write file error : ' + err);
      });
    });
  }

  static update(task) {
    getTasksFromFile(tasks => {
      if (tasks && tasks.length !== 0) {
        const updTasks = tasks;
        const i = tasks.findIndex(t => t._id === task._id);
        updTasks[i] = task;
        fs.writeFile(p, JSON.stringify(updTasks), err => {
          if (err) console.log('Write file error : ' + err);
        });
      }
    });
  }

  static delete(id) {
    getTasksFromFile(tasks => {
      if (tasks && tasks.length !== 0) {
        const updTasks = tasks;
        const i = tasks.findIndex(t => t._id === +id);
        updTasks.splice(i, 1);
        fs.writeFile(p, JSON.stringify(updTasks), err => {
          if (err) console.log('Write file error : ' + err);
        });
      }
    });
  }

  static getAll(cb) {
    getTasksFromFile(cb);
  }
}

module.exports = Task;
