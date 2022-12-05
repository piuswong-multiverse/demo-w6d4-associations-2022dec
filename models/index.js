const { Deck } = require('./Deck');
const { Collector } = require('./Collector');

// Associate the Deck and Collector models (tables) -- test this!!
// Collector:Deck --> 1:many
Collector.hasMany(Deck);
Deck.belongsTo(Collector); 

module.exports = {Deck, Collector};