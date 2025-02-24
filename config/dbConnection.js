const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('cashflow', 'root', 'admin@123', {
  host: 'localhost', // or your MySQL host
  dialect: 'mysql',  // because we're using MySQL
});

module.exports = sequelize;