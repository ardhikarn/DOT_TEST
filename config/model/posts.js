const Sequelize = require('sequelize')
const db = require("../database/mysql")

const posts = db.define('posts', {
  userId: Sequelize.INTEGER,
  title: Sequelize.STRING,
  body: Sequelize.TEXT
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = posts