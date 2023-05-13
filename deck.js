CARDS.DECKS = {};

class Deck {
    constructor(name, storageIndex) {
        this.name = name
        this.cards = {};
        CARDS.DECKS[name] = this;
        this.storageIndex = storageIndex;
    }

    addCard(count, name, set, foil, collector_number) {
            let cards = CARDS[name.toLowerCase()][set]
            let card;
            if (collector_number == undefined) {
                collector_number = COLLECTION.getCollectorNumber(name, set);
            }
            card = cards[collector_number];
            let cardName = card.name.toLowerCase();
            if (card.decks.includes(this)) {
                if (foil) {
                    this.cards[cardName].foil = this.cards[cardName].foil + count;
                }
                this.cards[cardName].count = this.cards[cardName].count + count;
                card.deckCards = card.deckCards + count;                
            } else {
                card.addDeck(this, count)
                let foil_count = 0;
                if (foil) {
                    foil_count = count;
                }
                this.cards[card.name.toLowerCase()] = {card: card, count: count, foil: foil_count};
            }
    }
}
