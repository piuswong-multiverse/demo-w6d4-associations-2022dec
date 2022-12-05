const { db } = require('./db');
const { Deck, Collector, Card } = require('./models');
const { seedDeck, seedCollector, seedCard } = require('./seedData');

describe("Collector and Deck models", () => {

  beforeAll( async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the 
    // test suite is run
    await db.sync({force: true});
  })

  // C from CRUD

  test ('if it can create Deck', async () => {
    const deck = await Deck.create({title:'Regular'});
    expect(deck).toBeDefined();
    expect(deck.title).toBe('Regular');
  })

  test('if it can create Collector', async () => {
    const collector = await Collector.create({name:'David', budget:200});
    expect(collector).toBeDefined();
    expect(collector.name).toBe('David');
  })

  // R from cRud

  test('if it can find a deck', async() => {
    const deck = await Deck.create({title: 'FireDeck'});
    // select * from decks;
    const decks = await Deck.findAll({
      where: {
        title: 'FireDeck'
      }
    })
    expect(decks).toBeDefined();
    expect(decks.length).toBe(1);
    expect(decks[0].title).toBe('FireDeck');
    expect(decks[0].id).toBe(2);
  })

  test('if it can find a collector', async() => {
    const susan = await Collector.create({name:'Susan', budget:300});
    const bart = await Collector.create({name: 'Bart', budget: 400});
    const collector = await Collector.findByPk(3);
    expect(collector).toBeDefined();
    expect(collector.name).toBe('Bart');
  })

  // crUd = Update
  // UPDATE table SET col=value WHERE conditions
  test('if it can update a collector', async() => {
    await Collector.update(
      {budget: 500},
      {where: {name: 'Susan'}}
    );
    const susan = await Collector.findByPk(2);
    expect(susan.budget).toBe(500);
  })

  // cruD = Delete
  test('if it can delete a deck', async() => {
    const deck = await Deck.findByPk(2);
    const destroyedDeck = await deck.destroy();
    expect(destroyedDeck.title).toBe("FireDeck");
  })

  // Test the associations between Deck & Collector
  test('if a Collector can have many Decks', async () => {
    await db.sync({ force:true }); // reset the db
    // created some database entries to test...
    let person1 = await Collector.create(seedCollector[0]);
    let deck1 = await Deck.create(seedDeck[0]);
    let deck2 = await Deck.create(seedDeck[1]);
    // create some associations...
    // .add[Model]
    await person1.addDeck(deck1);
    await person1.addDeck(deck2);
    // test the association...
    const person1decks = await person1.getDecks();
    expect(person1decks.length).toBe(2);
    expect(person1decks[0] instanceof Deck).toBeTruthy;
    expect(person1decks[0].title).toBe("Favorites");
  })

})

describe('Card model', () => {

  test('if Card can be created', async () => {
    await db.sync({ force: true });
    let card1 = await Card.create(seedCard[0]);
    expect(card1.name).toBe("charmander");
    expect(card1.price).toBe(192);
  })

})