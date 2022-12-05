const { db } = require('./db');
const { Deck, Collector } = require('./models');
const { seedCollector, seedDeck } = require('./seedData');

const seed = async() => {
  await db.sync({force: true});
  await Collector.bulkCreate(seedCollector);
  await Deck.bulkCreate(seedDeck);
  console.log("Database populated with seed data");
}

seed()
