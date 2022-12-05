const { db } = require('../db');
const { Sequelize } = require('sequelize');

const Deck = db.define('deck', {
  title: Sequelize.STRING
})

module.exports = { Deck };