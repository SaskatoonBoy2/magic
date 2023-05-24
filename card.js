
const cards = {};
cards.collected = {};

cards.exists = function(name, set, collector_number) {
    if (cards[name] !== undefined) {
        if (set === 'generic' || set === undefined) {
            return true;
        } else if (cards[name][set] !== undefined) {
            if (cards[name][set][collector_number] !== undefined) {
                return true;
            }
        }
    }
    return false;
}

cards.get = function(name,set_code,collector_number) {
    if (cards[name] == undefined) {
        return undefined
    }
    if (cards[name][set_code] == undefined) {
        return undefined
    }
    return cards[name][set_code][collector_number];
}

class GenericCard {
    constructor(card) {
        this.name = card.name;
        this.cards = [card];
        this.sets = [card.set];
        this.set_codes = [card.set_code];
        this.collector_numbers = [card.collector_number];
        this.colours = card.colours;
        this.rarity = card.rarity;
        this.type = card.type;
        this.text = card.text;
        this.flavour_text = card.flavour_text;
        this.count = card.count;
        this.foil = card.foil;
        this.imageURL = card.imageURL;
    }

    addCard(card, count, foil) {
        if (!this.cards.includes(card)) {
            this.cards.push(card);
            this.sets.push(card.set);
            this.set_codes.push(card.set_code);
        }
        if (foil) {
            this.foil = this.foil + count;
        }
        this.count = this.count + count;
    }
    
    getSet() {
        return this.sets[0];
    }

    getSetCode() {
        return this.set_codes[0];
    }

    getCollectorNumber() {
        return this.collector_numbers[0];
    }

    getColour() {
        if (this.type.toLowerCase().includes('land')) {
            return 'Land';
        }
        if (this.type.toLowerCase().includes('token')) {
            return 'Token';
        }
        if (this.colours.length == 0) {
            return 'Colourless';
        }
        if (this.colours.length == 1) {
            return this.colours[0];
        }
        return 'Multicolour';
    };

    getStorageString() {
        let text = '';
        let cardsInBox = this.count;
        let decks = [];
        let storageIndex = Infinity;
        for (let card of this.cards) {
            for (let deck of card.decks) {
                if (!decks.includes(deck)) {
                    decks.push(deck);
                }
            }
            if (card.storageIndex < storageIndex) {
                storageIndex = card.storageIndex;
            }
        }
        for (let deck of decks) {
            let count = deck.cards[this.name.toLowerCase()].count;
            text = text + count + ' cards in ' + getStorageName(deck.storageIndex) + '<br>';
            cardsInBox = cardsInBox - count;
        }
        let cardsInBinder = this.foil;
        if (cardsInBox < this.foil) {
            cardsInBinder = cardsInBox;
            cardsInBox = 0;
        } else {
            cardsInBox = cardsInBox - this.foil;
        }
        if (cardsInBinder > 0) {
            text = text + cardsInBinder + ' cards in ' + getStorageName(0) + '<br>';
        }
        text = text + cardsInBox + ' cards in ' + getStorageName(COLOURTOSTORAGE[this.getColour()], storageIndex);
        return text;
    }
}

class Card {

    constructor(id, set_code, name, colours, type, rarity, imageURL, collector_number, mana_cost, 
        converted_mana_cost, text, flavour_text, power, toughness, count, foil) {
        this.id = id;
        this.set = SETS[set_code];
        this.name = name;
        this.colours = colours;
        this.colours = JSON.parse(this.colours.replace('W', 'White').replace('B', 'Black').replace('R', 'Red').replace('U', 'Blue').replace('G', 'Green'));
        if (this.colours == null) {
            this.colours = [];
        }
        if (this.colours.length == 0) {
            if (name == 'Plains') {
                this.colours.push('White');
            }
            if (name == 'Forest') {
                this.colours.push('Green');
            }
            if (name == 'Mountain') {
                this.colours.push('Red');
            }
            if (name == 'Island') {
                this.colours.push('Blue');
            }
            if (name == 'Swamp') {
                this.colours.push('Black');
            }
        }
        this.type = type;
        this.rarity = rarity.substring(0, 1).toUpperCase() + rarity.substring(1, rarity.length);
        this.imageURL = imageURL;
        this.collector_number = collector_number;
        this.mana_cost = mana_cost;
        this.converted_mana_cost = converted_mana_cost;
        this.text = text;
        while (this.text.includes('\n')) {
            this.text = this.text.replace('\n', '<br>');
        }
        this.flavour_text = flavour_text;
        while (this.flavour_text.includes('\n')) {
            this.flavour_text = this.flavour_text.replace('\n', '<br>');
        }
        this.power = power;
        this.toughness = toughness;
        this.index = this.name.toLowerCase()
        if (this.index.includes('//')) {
            this.index = this.index.substring(0, this.index.indexOf(' // '));
        }
        this.set_code = set_code;
        this.foil = foil;
        this.count = count;
        this.decks = [];
        this.value = NaN;
        this.foilValue = NaN;
        this.storageIndex = 0;
        this.deckcards = 0;

        if (cards[this.index] == undefined) {
            cards[this.index] = {};
        }

        if (cards[this.index][this.set_code] == undefined) {
            cards[this.index][this.set_code] = {};
        }
        if (cards[this.index][this.set_code][this.collector_number] != undefined) {
            console.log(this.index+' already loaded');
        }
        cards[this.index][this.set_code][this.collector_number] = this;

    };

    addCount(count, foil) {
        this.count = this.count + count;
        if (foil) {
            this.foil = this.foil + count;
        }
        if (this.deckcards < count) {
            if (!foil) {
                let index = COLOURTOSTORAGE[this.getColour()];
                this.storageIndex = STORAGEINDEXES[index];
                STORAGEINDEXES[index] = STORAGEINDEXES[index] + count - this.deckcards;
            }
            this.deckcards = 0;
        } else {
            this.deckcards = this.deckcards - count;
        }
    }

    addDeck(deck, count) {
        this.decks.push(deck);
        this.deckcards = this.deckcards + count;
    }

    getColour() {
        if (this.type.toLowerCase().includes('land')) {
            return 'Land';
        }
        if (this.type.toLowerCase().includes('token')) {
            return 'Token';
        }
        if (this.colours.length == 0) {
            return 'Colourless';
        }
        if (this.colours.length == 1) {
            return this.colours[0];
        }
        return 'Multicolour';
    };
    
    getSet() {
        return this.set;
    }

    getSetCode() {
        return this.set_code;
    }

    getCollectorNumber() {
        return this.collector_number;
    }

    getValue() {
        if (isNaN(this.value)) {
            return 0;
        }
        return this.value;
    }

    getFoilValue() {
        if (isNaN(this.foilValue)) {
            return 0;
        }
        return this.foilValue;
    }

    getStorageString() {
        let text = '';
        let cardsInBox = this.count;
        for (let deck of this.decks) {
            let count = deck.cards[this.name.toLowerCase()].count;
            text = text + count + ' cards in ' + getStorageName(deck.storageIndex) + '<br>';
            cardsInBox = cardsInBox - count;
        }
        let cardsInBinder = this.foil;
        if (cardsInBox < this.foil) {
            cardsInBinder = cardsInBox;
            cardsInBox = 0;
        } else {
            cardsInBox = cardsInBox - this.foil;
        }
        if (cardsInBinder > 0) {
            text = text + cardsInBinder + ' cards in ' + getStorageName(0) + '<br>';
        }
        text = text + cardsInBox + ' cards in ' + getStorageName(COLOURTOSTORAGE[this.getColour()], this.storageIndex);
        return text;
    }

}
