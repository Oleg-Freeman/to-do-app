const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./db');
// const path = require('path');

// .env config
require('dotenv').config({ path: './config/.env' });

// Port number configuretion
const port = process.env.PORT || 5000;

// Connect DB
connectDb();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for front end
// app.use(express.static(path.join(__dirname, 'client', 'build')));

// Routes
if (process.env.STORE_LOCALLY === 'false') {
  app.use('/users', require('./routes/users'));
  app.use('/tasks', require('./routes/tasks'));
}
if (process.env.STORE_LOCALLY === 'true') {
  // app.use('/users', require('./routes/users'));
  // app.use('/posts', require('./routes/posts'));
}

// app.get('/*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
