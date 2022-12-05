const { db } = require('../db');
const { Sequelize } = require('sequelize');

const Collector = db.define('collector', {
  name: Sequelize.STRING,
  budget: Sequelize.NUMBER
})

module.exports = { Collector };