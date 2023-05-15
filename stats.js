
const stats = {};
stats.queue = [];
stats.fetchDelay = 100;

stats.show = function() {
    display.clear();
    show(display.backButton);
    display.statsPageOpen = true;
    display.nameHeader.innerText = 'Statistics';
    display.setHeader.innerText = 'Total Common Cards: ' + stats.total.common.count + ' [$'+stats.total.common.value+']';
    display.colourHeader.innerText = 'Total Uncommon Cards: ' + stats.total.uncommon.count + ' [$'+stats.total.uncommon.value+']';
    display.rarityHeader.innerText = 'Total Rare Cards: ' + stats.total.rare.count + ' [$'+stats.total.rare.value+']';
    display.typeHeader.innerText = 'Total Mythic Cards: ' + stats.total.mythic.count + ' [$'+stats.total.mythic.value+']';
    display.countHeader.innerText = 'Total Cards: ' + stats.total.count + ' [$'+stats.total.value+']';
}

stats.calculate = function() {
    let colours = ['white', 'red', 'blue', 'green', 'black', 'colourless', 'multicolour', 'mixed', 'total'];
    for (let colour of colours) {
        stats[colour] = {};
        stats[colour].cards = [];
        stats[colour].count = 0;
        stats[colour].value = 0;
        stats[colour].common = {count: 0, value: 0};
        stats[colour].uncommon = {count: 0, value: 0};
        stats[colour].rare = {count: 0, value: 0};
        stats[colour].mythic = {count: 0, value: 0}; 
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
  
    for (let colour of colours) {
      let cStat = stats[colour];
      for (let card of cStat.cards) {
        stats.fetch(card.set_code, card.collector_number);
        cStat.count = cStat.count + card.count;
        stats.total.count = stats.total.count + card.count;
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

stats.runNextFetch = async function(setCode, setNumber) {
    await delay(stats.fetchDelay);
    //fetch("https://api.scryfall.com/cards/"+setCode+"/"+setNumber).then(function(res) {
       //return res.json()}).then(function(data) {statsReturned(data);});
}

stats.returned = function() {
    if (stats.queue.length > 0) {
      let fetchData = stats.queue.shift();
      stats.runNextFetch(fetchData[0], fetchData[1]);
    }
    let singleValue = parseFloat(data.prices.usd);
    let foilValue = parseFloat(data.prices.usd_foil);
    statsCalced = statsCalced + 1;
    if (isNaN(singleValue)) {
      singleValue = 0;
    }
    if (isNaN(foilValue)) {
      foilValue = 0;
    }
    if (cards.exists(data.name.toLowerCase(), data.set, data.collector_number)) {
      let card = cards.get(data.name.toLowerCase(), data.set, data.collector_number);
      let colour = card.getColour();
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
      if (display.statsPageOpen) {display.showStats();}
    }
}

stats.fetch = function(setCode, setNumber) {
    if (stats.queue.length == 0) {
        stats.runNextFetch(setCode, setNumber);
    } else {
        stats.queue.push([setCode, setNumber]);
    }
}
