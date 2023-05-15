const collection = {};
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

collection.getCollectorNumber = function(name, set) {
    let cardNames = Object.keys(cards[name.toLowerCase()][set]);
    let collector_number = Infinity;
    for (let number of cardNames) {
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
                    if (alphabet.indexOf(alt_char) < alphabet.indexOf(c_char)) {
                        collector_number = number;
                    }
                }
            }
         }
    }
    return collector_number;
}
collection.addCard =  function(count, name, set, foil, collector_number) {

    if (collector_number == undefined) {
        collector_number = collection.getCollectorNumber(name, set);
    }
    let card = cards[name.toLowerCase()][set][collector_number];
    card.addCount(count, foil);
    if (cards.collected[name.toLowerCase()] == undefined) {
        cards.collected[name.toLowerCase()] = {};
        cards.collected[name.toLowerCase()].generic = new GenericCard(card);
    } else {
        cards.collected[name.toLowerCase()].generic.addCard(card, count, foil);
    }
    if (cards.collected[name.toLowerCase()][set] == undefined) {
        cards.collected[name.toLowerCase()][set] = {};
        cards.collected[name.toLowerCase()][set][collector_number] = card;
    }
    
}
