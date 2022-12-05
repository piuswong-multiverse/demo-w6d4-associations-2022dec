const { Deck } = require('./Deck');
const { Collector } = require('./Collector');
const { Card } = require('./Card');

// Associate the Deck and Collector models (tables) -- test this!!
// Collector:Deck --> 1:many
Collector.hasMany(Deck);
Deck.belongsTo(Collector); 

// Let's associate Cards to Decks (many-to-many)
Card.belongsToMany(Deck, {through: 'card_deck'});
Deck.belongsToMany(Card, {through: 'card_deck'});

module.exports = {Deck, Collector, Card};