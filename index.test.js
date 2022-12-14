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

  test('if a Deck can have many Cards, and if a Card can have many Decks', async () => {
    await db.sync({ force: true });
    // populate the database with a deck and some cards
    let deck1 = await Deck.create(seedDeck[0]);
    let deck2 = await Deck.create(seedDeck[1]);
    let card1 = await Card.create(seedCard[0]);
    let card2 = await Card.create(seedCard[1]);
    // create associations
    // await deck1.addCard(card1);
    // await deck1.addCard(card2);
    await deck1.addCards([card1, card2]);
    // test the associations
    const deck1cards = await deck1.getCards();
    expect(deck1cards.length).toBe(2);

    await deck2.addCard(card1);
    const decksCard1 = await card1.getDecks();
    expect(decksCard1.length).toBe(2);
    const decksCard2 = await card2.getDecks();
    expect(decksCard2.length).toBe(1);
  })

  test('Cards can be eager-loaded with Decks', async () => {
    await db.sync({ force:true });
    // populate db
    await Collector.bulkCreate(seedCollector);
    await Deck.bulkCreate(seedDeck);
    await Card.bulkCreate(seedCard);
    // create some associations to test
    let deck1 = await Deck.findByPk(1);
    let card1 = await Card.findByPk(1);
    let card2 = await Card.findByPk(2);
    await deck1.addCards([card1,card2]);
    // test eager loading
    const wholeDeckWithCards = await Deck.findAll({
      include: [{
        model: Card
        // if you renamed/aliased the models you need to use "as" also; see https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
      }]
    });
    console.log(wholeDeckWithCards[0]);
    expect(wholeDeckWithCards[0].cards.length).toBe(2);
    expect(wholeDeckWithCards[1].cards.length).toBe(0);
    // console.log(wholeDeckWithCards);
  })

})