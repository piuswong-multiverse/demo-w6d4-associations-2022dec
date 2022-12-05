const { db } = require('../db');
const { Sequelize } = require('sequelize');

const Card = db.define('card', {
    name: Sequelize.STRING,
    imgURL: Sequelize.STRING,
    price: Sequelize.INTEGER
})

module.exports = { Card }