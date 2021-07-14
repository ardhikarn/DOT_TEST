require("dotenv").config();
const Sequelize = require("sequelize");
var db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
})

module.exports = db;
