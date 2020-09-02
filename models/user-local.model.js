/* eslint-disable standard/no-callback-literal */
const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'users.json');

const getUsersFromFile = (cb) => {
  fs.readFile(p, (err, content) => {
    if (err) {
      return cb([]);
    }
    else {
      cb(JSON.parse(content));
    }
  });
};

class UserLocal {
  constructor(email = '', password = '', userName = '', isAdmin = false) {
    this.email = email;
    this.password = password;
    this.userName = userName;
    this.isAuthenticated = false;
    this.isAdmin = isAdmin;
    this.createdAt = new Date();
    this._id = Date.now();
  }

  save() {
    getUsersFromFile(users => {
      users.push(this);
      fs.writeFile(p, JSON.stringify(users), err => {
        if (err) console.log('Write file error : ' + err);
      });
    });
  }

  static update(user) {
    getUsersFromFile(users => {
      if (users && users.length !== 0) {
        const updUsers = users;
        const i = users.findIndex(u => u._id === user._id);
        updUsers[i] = user;
        fs.writeFile(p, JSON.stringify(updUsers), err => {
          if (err) console.log('Write file error : ' + err);
        });
      }
    });
  }

  static delete(id) {
    getUsersFromFile(users => {
      if (users && users.length !== 0) {
        const updUsers = users;
        const i = users.findIndex(u => u._id === +id);
        updUsers.splice(i, 1);
        fs.writeFile(p, JSON.stringify(updUsers), err => {
          if (err) console.log('Write file error : ' + err);
        });
      }
    });
  }

  static getAll(cb) {
    getUsersFromFile(cb);
  }
}

module.exports = UserLocal;
