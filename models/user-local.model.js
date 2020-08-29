class UserLocal {
  constructor(email = '', password = '', userName = '', tasks = [], isAuthenticated = false) {
    this.email = email;
    this.password = password;
    this.userName = userName;
    this.tasks = tasks;
    this.isAuthenticated = isAuthenticated;
  }
}

module.exports = UserLocal;
