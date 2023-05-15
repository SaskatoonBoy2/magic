// MTG Database
// Eric James
// Dec Wed. 26 2023
//

function fetchCardData(setCode, setNumber) {
  fetch("https://api.scryfall.com/cards/"+setCode+"/"+setNumber)
  .then(res => res.json()).then(data => updateDisplayRaw(data));
}

function clearList() {
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function logCardsOfValue(colour, value) {
  for (let card of STATS[colour].values[value]) {
    if (card.foil > 0) {
      console.log(card.name + ' foils ($' + card.foilValue + ')');
    }
    console.log(card.name + ' ($' + card.value+')');
  }
}
