require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const { database } = keys;

// Function to setup and connect to MongoDB
const setupDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('useCreateIndex', true);
    // Connect to MongoDB
    mongoose
      .connect(database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() =>
        console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)
      )
      .catch(err => console.log(err));
  } catch (error) {
    return null;
  }
};

module.exports = setupDB;
