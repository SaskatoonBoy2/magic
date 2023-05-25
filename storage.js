const storage = {};
storage.decks = {};
storage.boxes = [];
storage.colours = {};

class Storage {
    constructor(name) {
        this.index = storage.index;
        storage.index += 1;
        this.name = name;
        this.groups = [];
    } 

    getCardLocation(index, group) {
        let location = 0;
        if (this.groups.includes(group)) {
            for (let cGroup of this.groups) {
                if (cGroup === group) {
                    return location + index;
                }
                location += cGroup.index;
            }
        }
    }

    getName() {
        return this.name;
    }
}

class Binder extends Storage {
    constructor() {
        super('Card Binder #1');
        storage.binder = this;
        this.cards = [];
        this.index = 0;
    }

    getName(location) {
        return this.name + ' (' + location + ')';
    }

    getIndex(count) {
        let toReturn = this.index + 1;
        this.index += count;
        return toReturn;
    }
}

class DeckBox extends Storage {
    constructor(colour, count) {
        super(colour+' Deck Box #'+count);
        this.colour = colour;
        if (storage.decks[colour.toLowerCase()] === undefined) {
            storage.decks[colour.toLowerCase()] = [];
        }
        storage.decks[colour.toLowerCase()].push(this);
    }
}

class Box extends Storage {
    constructor(count) {
        if (count == undefined) {
            count = storage.boxes.length+1;
        }
        super('Cardboard Box #'+count);
        storage.boxes.push(this);
    }
}

class ColourGroup {
    constructor(colour, container) {
        this.colour = colour.toLowerCase();
        this.index = 0;
        this.container = container;
        container.groups.push(this);
        storage.colours[this.colour] = this;
    }

    getIndex(count) {
        let toReturn = this.index + 1;
        this.index += count;
        return toReturn;
    }

    getName(location) {
        return this.container.name + ' (' + this.container.getCardLocation(location, this) + ')';
    } 
}

new Binder();
new Box();
new Box();
new Box();
new Box();
new Box();
new Box();
new DeckBox('Purple', 1);
new DeckBox('Purple', 2);
new DeckBox('Sapphire', 1);
new DeckBox('Magenta', 1);
new DeckBox('Green', 1);

new ColourGroup('Black', storage.boxes[0]);
new ColourGroup('Blue', storage.boxes[1]);
new ColourGroup('Green', storage.boxes[2]);
new ColourGroup('Red', storage.boxes[3]);
new ColourGroup('White', storage.boxes[4]);
new ColourGroup('Land', storage.boxes[5]);
new ColourGroup('Token', storage.boxes[0]);
new ColourGroup('Mixed', storage.boxes[1]);
new ColourGroup('Colourless', storage.boxes[2]);
new ColourGroup('Multicolour', storage.boxes[4]);
