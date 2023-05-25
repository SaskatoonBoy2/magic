
const stats = {};
stats.queue = [];
stats.fetchDelay = 0.01;
stats.div = getElement('statsDiv');
stats.elements = {};
stats.calculatedCards = 0;
stats.colours = ['white', 'red', 'blue', 'green', 'black', 'colourless', 'multicolour', 'mixed', 'token', 'land', 'total'];

stats.expandSection = function(colour) {
  if (stats.elements[colour].button.innerText == 'Expand') {
    show(stats.elements[colour].div);
    stats.elements[colour].button.innerText = 'Collapse';
  } else {
    hide(stats.elements[colour].div);
    stats.elements[colour].button.innerText = 'Expand';
  }
}

stats.show = function() {
    display.clear();
    show(display.backButton);
    display.statsPageOpen = true;
    show(stats.div);
    for (colour of stats.colours) {
      stats.elements[colour].commons.innerText = 'Common Cards: ' + stats[colour].common.count + ' [$'+stats[colour].common.value+']';
      stats.elements[colour].uncommons.innerText = 'Uncommon Cards: ' + stats[colour].uncommon.count + ' [$'+stats[colour].uncommon.value+']';
      stats.elements[colour].rares.innerText = 'Rare Cards: ' + stats[colour].rare.count + ' [$'+stats[colour].rare.value+']';
      stats.elements[colour].mythics.innerText = 'Mythic Cards: ' + stats[colour]. mythic.count + ' [$'+stats[colour].mythic.value+']';
      stats.elements[colour].cards.innerText = 'Total Cards: ' + stats[colour].count + ' [$'+stats[colour].value+']';
    }
}

stats.calculate = function() {
    for (let colour of stats.colours) {
        stats[colour] = {};
        stats[colour].cards = [];
        stats[colour].count = 0;
        stats[colour].uCount = 0;
        stats[colour].value = 0;
        stats[colour].common = {count: 0, uCount: 0, value: 0};
        stats[colour].uncommon = {count: 0, uCount: 0, value: 0};
        stats[colour].rare = {count: 0, uCount: 0, value: 0};
        stats[colour].mythic = {count: 0, uCount: 0, value: 0}; 
        stats.elements[colour] = {};
        stats.elements[colour].div = getElement(colour+'Div');
        stats.elements[colour].commons = getElement(colour+'Commons');
        stats.elements[colour].uncommons = getElement(colour+'Uncommons');
        stats.elements[colour].rares = getElement(colour+'Rares');
        stats.elements[colour].mythics = getElement(colour+'Mythics');
        stats.elements[colour].cards = getElement(colour+'Cards');
        stats.elements[colour].button = getElement(colour+'Button');
    }
    for (let index of Object.keys(cards.collected)) {
      let sets = cards.collected[index];
      for (let setIndex of Object.keys(sets)) {
        if (setIndex != 'generic') {
          let set = sets[setIndex];
          for (let collector_number of Object.keys(set)) {
            let card = set[collector_number];
              
            stats[card.getColour().toLowerCase()].cards.push(card);
            
          }
        }
      }
    }
  
    for (let colour of stats.colours) {
      let cStat = stats[colour];
      for (let card of cStat.cards) {
        stats.fetch(card.set_code, card.collector_number);
        cStat.count = cStat.count + card.count;
        cStat.uCount += 1;
        stats.total.count = stats.total.count + card.count;
        stats.total.uCount += 1;
        if (card.rarity == 'Common') {
          cStat.common.count = cStat.common.count + card.count;
          stats.total.common.count = stats.total.common.count + card.count;
        }
        if (card.rarity == 'Uncommon') {
          cStat.uncommon.count = cStat.uncommon.count + card.count;
          stats.total.uncommon.count = stats.total.uncommon.count + card.count;
        }
        if (card.rarity == 'Rare') {
          cStat.rare.count = cStat.rare.count + card.count;
          stats.total.rare.count = stats.total.rare.count + card.count;
        }
        if (card.rarity == 'Mythic') {
          cStat.mythic.count = cStat.mythic.count + card.count;
          stats.total.mythic.count = stats.total.mythic.count + card.count;
        }
      }
    }
}

stats.runNextFetch = async function() {
    await delay(stats.fetchDelay);
    fetch("https://api.scryfall.com/cards/"+stats.queue[0][0]+"/"+stats.queue[0][1]).then(function(res) {
       return res.json()}).then(function(data) {stats.queue.shift();stats.returned(data);});
}

stats.returned = function(data) {
    if (stats.queue.length > 0) {
      stats.runNextFetch();
    }
    stats.calculatedCards += 1;
    console.log('Remaining Cards: ' + (stats.total.uCount - stats.calculatedCards));
    let singleValue = parseFloat(data.prices.usd);
    let foilValue = parseFloat(data.prices.usd_foil);
    if (isNaN(singleValue)) {
      singleValue = 0;
    }
    if (isNaN(foilValue)) {
      foilValue = 0;
    }
    if (cards.exists(data.name.toLowerCase(), data.set, data.collector_number)) {
      let card = cards.get(data.name.toLowerCase(), data.set, data.collector_number);
      let colour = card.getColour().toLowerCase();
      let value = 0;
      if (card.foil > 0 && foilValue > 2) {
        value = value + foilValue * card.foil;
      }
      if (card.count - card.foil > 0 && singleValue > 2) {
        value = value + singleValue*(card.count-card.foil)
      }
      value = value * 0.65;
      card.value = singleValue;
      card.foilValue = foilValue;
      stats[colour].value = Math.round((stats[colour].value + value)*100)/100;
      stats.total.value = Math.round((stats.total.value + value)*100)/100;
      for (let rarity of Object.keys(stats[colour])) {
        if (card.rarity.toLowerCase() == rarity) {
            stats[colour][rarity].value = Math.round((stats[colour][rarity].value + value)*100)/100;
            stats.total[rarity].value = Math.round((stats.total[rarity].value + value)*100)/100;
        }
      }
      if (display.statsPageOpen) {stats.show();}
    }
}

stats.fetch = function(setCode, setNumber) {
  stats.queue.push([setCode, setNumber]);
    if (stats.queue.length == 1) {
        stats.runNextFetch();
    }
}
