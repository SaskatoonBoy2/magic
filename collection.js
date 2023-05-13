const COLLECTION = {};
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

COLLECTION.getCollectorNumber = function(name, set) {
    cards = Object.keys(CARDS[name.toLowerCase()][set]);
    let collector_number = Infinity;
    for (let number of cards) {
        if (typeof number == 'number') {
            if (typeof collector_number == 'number') {
                if (number < collector_number) {
                    collector_number = number;
                }
            } else {
                let c_number = parseInt(collector_number.substring(0, collector_number.length-1));
                if (number < c_number) {
                    collector_number = number;
                }
            }
        } else {
            if (typeof collector_number == 'number') {
                let alt_number = parseInt(number.substring(0, number.length));
                if (alt_number < collector_number) {
                    collector_number = number;
                }
            } else {
                let alt_number = parseInt(number.substring(0, number.length));
                let c_number = parseInt(collector_number.substring(0, collector_number.length-1));
                if (alt_number < c_number) {
                    collector_number = number;
                } else if (alt_number === c_number) {
                    let alt_char = number.substring(number.length, number.length);
                    let c_char = number.substring(collector_number.length, collector_number.length);
                    if (ALPHABET.indexOf(alt_char) < ALPHABET.indexOf(c_char)) {
                        collector_number = number;
                    }
                }
            }
         }
    }
    return collector_number;
}
COLLECTION.addCard =  function(count, name, set, foil, collector_number) {

    if (collector_number == undefined) {
        collector_number = COLLECTION.getCollectorNumber(name, set);
    }
    let card = CARDS[name.toLowerCase()][set][collector_number];
    card.addCount(count, foil);
    if (CARDS.COLLECTED[name.toLowerCase()] == undefined) {
        CARDS.COLLECTED[name.toLowerCase()] = {};
        CARDS.COLLECTED[name.toLowerCase()].generic = new GenericCard(card);
    } else {
        CARDS.COLLECTED[name.toLowerCase()].generic.addCard(card, count, foil);
    }
    if (CARDS.COLLECTED[name.toLowerCase()][set] == undefined) {
        CARDS.COLLECTED[name.toLowerCase()][set] = {};
        CARDS.COLLECTED[name.toLowerCase()][set][collector_number] = card;
    }
    
}
