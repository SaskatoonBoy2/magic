cards.decks = {};

class Deck {
    constructor(name, storageIndex) {
        this.name = name
        this.cards = {};
        cards.decks[name] = this;
        this.storageIndex = storageIndex;
    }

    addCard(count, name, set_code, foil, collector_number) {
            let set = cards[name.toLowerCase()][set_code]
            let card;
            if (collector_number == undefined) {
                collector_number = collection.getCollectorNumber(name, set_code);
            }
            card = set[collector_number];
            let cardName = card.name.toLowerCase();
            if (card.decks.includes(this)) {
                if (foil) {
                    this.cards[cardName].foil += count;
                }
                this.cards[cardName].count += count;
                card.deckCards += count;                
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
