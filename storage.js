const STORAGEINDEXES = [];
const STORAGESTRINGS = [];
const COLOURTOSTORAGE = {'Black': 1, 'Blue': 2, 'Green': 3, 'Red': 4, 'White':5, 'Land':11, 'Token': 1, 'Mixed': 2, 'Colourless': 3, 'Multicolour': 5};

function createStorage(name) {
    STORAGESTRINGS.push(name.toLowerCase());
    STORAGEINDEXES.push(1);
}

function getStorageName(index, cardNumber) {
    let name = STORAGESTRINGS[index];
    console.log(name);
    console.log(index);
    if (name.includes('deck')) {
        return name;
    }
    return name + ' (' + cardNumber + ')';
}

createStorage('Card Binder #1'); 
createStorage('Cardboard Box #1');
createStorage('Cardboard Box #2');
createStorage('Cardboard Box #3');
createStorage('Cardboard Box #4');
createStorage('Cardboard Box #5');
createStorage('Purple Deck Box #1');
createStorage('Purple Deck Box #2');
createStorage('Sapphire Deck Box #1');
createStorage('Magenta Deck Box #1');
createStorage('Green Deck Box #1');
createStorage('Cardboard Box #6'); // 11

