const Sequelize = require('sequelize')
const db = require("../database/mysql")

const comments = db.define('comments', {
  postId: Sequelize.INTEGER,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  body: Sequelize.STRING
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = comments