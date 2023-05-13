// MTG Database
// Eric James
// Dec Wed. 26 2023
//

const backButton = new p5.Element(document.getElementById('backbutton'));
const previousButton = new p5.Element(document.getElementById('previousbutton'));
const nextButton = new p5.Element(document.getElementById('nextbutton'));
const searchbar = new p5.Element(document.getElementById('searchbar'));
const typesearchbar = new p5.Element(document.getElementById('typesearchbar'));
const setseparate = new p5.Element(document.getElementById('setseparate'));
const setseparatelabel = new p5.Element(document.getElementById('setseparatelabel'));
const pagelabel = new p5.Element(document.getElementById('pagelabel'));
const nameHeader = new p5.Element(document.getElementById('name'));
const setHeader = new p5.Element(document.getElementById('set'));
const colourHeader = new p5.Element(document.getElementById('colour'));
const rarityHeader = new p5.Element(document.getElementById('rarity'));
const typeHeader = new p5.Element(document.getElementById('type'));
const ownHeader = new p5.Element(document.getElementById('own'));
const foilHeader = new p5.Element(document.getElementById('foil'));
const imageDisplay = new p5.Element(document.getElementById('image'));
const listDiv = new p5.Element(document.getElementById('list'));
const valueP = new p5.Element(document.getElementById('value'));
const textP = new p5.Element(document.getElementById('text'));
const flavourP = new p5.Element(document.getElementById('flavour'));
const storageP = new p5.Element(document.getElementById('storage'));
const STATS = {};
let lastval = '';
let lasttypeval = '';
let results = [];
let lastKeyword;
let page = 1;
const pageSize = 50;
let pageMax = 1;
let statsPageOpen = false;
let valueFetches = [];
let valuesFetching = 0;
const fetchableCount = 100;
let statsCalced = 0;
let retries = {};

function createStatsLink() {
  let code = 'clearList(); updateStats();';
  let link = createA('#', 'Statistics');
  link.elt.setAttribute('onclick', code);
  link.parent(listDiv);
}

function nextPage() {
  if (page < pageMax) {
    page = page + 1;
    displayResults();
    if (page == pageMax) {
      nextButton.addClass('hidden');
    }
    if (page > 1) {
      previousButton.removeClass('hidden');
    }
  }
}

function previousPage() {
  if (page > 1) {
    page = page - 1;
    displayResults();
    if (page == 1) {
      previousButton.addClass('hidden');
    } 
    if (page == pageMax-1) {
      nextButton.removeClass('hidden');
    }
  }
}

function displayResults() {
  clearList();
  pagelabel.elt.innerText = 'Page ' + page + ' of ' + pageMax;
  if (page == 1) {
    previousButton.addClass('hidden');
  } else {
    previousButton.removeClass('hidden');
  }
  if (page == pageMax) {
    nextButton.addClass('hidden');
  } else {
    nextButton.removeClass('hidden');
  }
  let start = (page-1)*pageSize;
  let end = page*pageSize;
  if (end > results.length) {
    end = results.length;
  }
  createStatsLink();
  for (let index = start; index < end; index = index + 1) {
    let card = results[index];
    let name = card.name;
    let set = card.getSet();
    let set_code = card.getSetCode();
    let collector_number = card.getCollectorNumber();
    let count = card.count;
    let foil = card.foil;
    let displayText = name + ' ('+set+') ['+count+']';
    let code = 'clearList(); fetchCardData(\''+set_code+'\', '+collector_number+');';
    if (!setseparate.elt.checked) {
      displayText = name + ' ['+count+']';
      let convertedname = '';
      let chars = ['\'', '\"']; 
      for (let char of card.name) {
        if (chars.includes(char)) {
          convertedname = convertedname + '\\';
        }
        convertedname = convertedname + char;
      }
      code = 'clearList(); updateDisplay(\''+convertedname+'\', \''+set_code+'\', '+collector_number+', true, '+count+', '+foil+');';
    }
    let link = createA('#', displayText);
    link.elt.setAttribute('onclick', code);
    link.parent(listDiv);
  }
}

function updateStats() {
  if (!statsPageOpen) {
    backButton.removeClass('hidden');
    nextButton.addClass('hidden');
    previousButton.addClass('hidden');
    pagelabel.addClass('hidden');
    searchbar.addClass('hidden');
    typesearchbar.addClass('hidden');
    setseparate.addClass('hidden');
    setseparatelabel.addClass('hidden');
  }
  statsPageOpen = true;
  nameHeader.html('Statistics');
  setHeader.html('Total Common Cards: ' + STATS.Total.common.count + ' [$'+STATS.Total.common.value+']');
  colourHeader.html('Total Uncommon Cards: ' + STATS.Total.uncommon.count + ' [$'+STATS.Total.uncommon.value+']');
  rarityHeader.html('Total Rare Cards: ' + STATS.Total.rare.count + ' [$'+STATS.Total.rare.value+']');
  typeHeader.html('Total Mythic Cards: ' + STATS.Total.mythic.count + ' [$'+STATS.Total.mythic.value+']');
  ownHeader.html('Total Cards: ' + STATS.Total.count + ' [$'+STATS.Total.value+']');
}

function calcStats() {
  STATS.White = {};
  STATS.Red = {};
  STATS.Blue = {};
  STATS.Green = {};
  STATS.Black = {};
  STATS.Colourless = {};
  STATS.Multicolour = {};
  STATS.Mixed = {};
  STATS.Total = {};
  for (let colour of Object.keys(STATS)) {
    STATS[colour].cards = [];
    STATS[colour].count = 0;
    STATS[colour].value = 0;
    STATS[colour].common = {count: 0, value: 0};
    STATS[colour].uncommon = {count: 0, value: 0};
    STATS[colour].rare = {count: 0, value: 0};
    STATS[colour].mythic = {count: 0, value: 0}; 
  }
  
  for (let index of Object.keys(CARDS.COLLECTED)) {
    let sets = CARDS.COLLECTED[index];
    for (let setIndex of Object.keys(sets)) {
      if (setIndex != 'generic') {
        let set = sets[setIndex];
        for (let collector_number of Object.keys(set)) {
          let card = set[collector_number];
            
          STATS[card.getColour()].cards.push(card);
          
        }
      }
    }
  }

  for (let colour of Object.keys(STATS)) {
    let cStat = STATS[colour];
    for (let card of cStat.cards) {
      fetchStats(card.set_code, card.collector_number);
      cStat.count = cStat.count + card.count;
      STATS.Total.count = STATS.Total.count + card.count;
      if (card.rarity == 'Common') {
        cStat.common.count = cStat.common.count + card.count;
        STATS.Total.common.count = STATS.Total.common.count + card.count;
      }
      if (card.rarity == 'Uncommon') {
        cStat.uncommon.count = cStat.uncommon.count + card.count;
        STATS.Total.uncommon.count = STATS.Total.uncommon.count + card.count;
      }
      if (card.rarity == 'Rare') {
        cStat.rare.count = cStat.rare.count + card.count;
        STATS.Total.rare.count = STATS.Total.rare.count + card.count;
      }
      if (card.rarity == 'Mythic') {
        cStat.mythic.count = cStat.mythic.count + card.count;
        STATS.Total.mythic.count = STATS.Total.mythic.count + card.count;
      }
    }
  }
  console.log(STATS);
}

function statsReturned(data) {
  valuesFetching = valuesFetching - 1;
  if (valueFetches.length > 0) {
    let fetchInfo = valueFetches.shift();
    delayedFetchStatsData(fetchInfo[0], fetchInfo[1]);
  }
  let sValue = parseFloat(data.prices.usd);
  let fValue = parseFloat(data.prices.usd_foil);
  statsCalced = statsCalced + 1;
  if (isNaN(sValue)) {
    sValue = 0;
  }
  if (isNaN(fValue)) {
    fValue = 0;
  }
  let id = data.id;
  if (Object.keys(CARDSBYID).includes(id)) {
    let card = CARDSBYID[id];
    let colour = card.getColour();
    let value = 0;
    if (card.foil > 0 && fValue > 2) {
      value = value + fValue * card.foil;
    }
    if (card.count - card.foil > 0 && sValue > 2) {
      value = value + sValue*(card.count-card.foil)
    }
    value = value * 0.65;
    card.value = sValue;
    card.foilValue = fValue;
    STATS[colour].value = Math.round((STATS[colour].value + value)*100)/100;
    STATS.Total.value = Math.round((STATS.Total.value + value)*100)/100;
    if (card.rarity == 'Common') {
      STATS[colour].common.value = Math.round((STATS[colour].common.value + value)*100)/100;
      STATS.Total.common.value = Math.round((STATS.Total.common.value + value)*100)/100;
    }
    if (card.rarity == 'Uncommon') {
      STATS[colour].uncommon.value = Math.round((STATS[colour].uncommon.value + value)*100)/100;
      STATS.Total.uncommon.value = Math.round((STATS.Total.uncommon.value + value)*100)/100;
    }
    if (card.rarity == 'Rare') {
      STATS[colour].rare.value = Math.round((STATS[colour].rare.value + value)*100)/100;
      STATS.Total.rare.value = Math.round((STATS.Total.rare.value + value)*100)/100;
    }
    if (card.rarity == 'Mythic') {
      STATS[colour].mythic.value = Math.round((STATS[colour].mythic.value + value)*100)/100;
      STATS.Total.mythic.value = Math.round((STATS.Total.mythic.value + value)*100)/100;
    }
    if (statsPageOpen) {updateStats();}
  }
}

function fetchStats(setCode, setNumber) {
  if (valuesFetching < fetchableCount) {
    fetchStatsData(setCode, setNumber);
  } else {
    valueFetches.push([setCode, setNumber]);
  }
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function delayedFetchStatsData(setCode, setNumber) {
  valuesFetching = valuesFetching + 1;
  await delay(100);
  fetchStatsDataRaw(setCode, setNumber);
}

function fetchStatsData(setCode, setNumber) {
  valuesFetching = valuesFetching + 1;
  fetchStatsDataRaw(setCode, setNumber);
}

function fetchStatsDataRaw(setCode, setNumber) {
  try {
    fetch("https://api.scryfall.com/cards/"+setCode+"/"+setNumber).then(function(res) {
       try {return res.json()} catch {
        if (retries[setCode+setNumber] == undefined) {
          retries[setCode+setNumber] = 1;
        } else {retries[setCode+setNumber] = retries[setCode+setNumber] + 1};
        console.log(retries[setCode+setNumber] + ' retries of ' +setCode+', '+setNumber);
        fetchStats(setCode, setNumber);};
      }).then(function(data) {try
      {
        statsReturned(data);
      } catch(error) {
        if (retries[setCode+setNumber] == undefined) {
          retries[setCode+setNumber] = 1;
        } else {retries[setCode+setNumber] = retries[setCode+setNumber] + 1};
        console.log(retries[setCode+setNumber] + ' retries of ' +setCode+', '+setNumber);
        fetchStats(setCode, setNumber);
      };
    });
  } catch(error) {
    if (retries[setCode+setNumber] == undefined) {
      retries[setCode+setNumber] = 1;
    } else {retries[setCode+setNumber] = retries[setCode+setNumber] + 1};
    console.log(retries[setCode+setNumber] + ' retries of ' +setCode+', '+setNumber);
    fetchStats(setCode, setNumber);
  };
}

function fetchCardData(setCode, setNumber) {
  fetch("https://api.scryfall.com/cards/"+setCode+"/"+setNumber)
  .then(res => res.json()).then(data => updateDisplayRaw(data));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateList('', '');
  calcStats();
}

function draw() {
  
  let val = searchbar.value();
  let typeval = typesearchbar.value();
  if (lastval != val || lasttypeval != typeval) {
    lastval = val;
    lasttypeval = typeval;
    updateList(val.toLowerCase(), typeval.toLowerCase());
  }
}

function clearDisplay() {
  nameHeader.html('');
  setHeader.html('');
  colourHeader.html('');
  rarityHeader.html('');
  typeHeader.html('');
  ownHeader.html('');
  foilHeader.html('');
  valueP.html('');
  textP.html('');
  flavourP.html('');
  storageP.html('');
  imageDisplay.elt.src = '';
  imageDisplay.addClass('hidden');
  backButton.addClass('hidden');
  nextButton.removeClass('hidden');
  previousButton.removeClass('hidden');
  pagelabel.removeClass('hidden');
  searchbar.removeClass('hidden');
  typesearchbar.removeClass('hidden');
  setseparate.removeClass('hidden');
  setseparatelabel.removeClass('hidden');
  statsPageOpen = false;
}

function updateDisplay(name, set_code, collector_number, isCombined, totalCardCcount, totalFoilCount) {
  let card = CARDS[name.toLowerCase()][set_code][collector_number];
  nameHeader.html(card.name);
  colourHeader.html('  Colour: ' + card.colours);
  rarityHeader.html('  Rarity: ' + card.rarity);
  typeHeader.html('  Type: ' + card.type);
  textP.html('  Text: ' + card.text);
  flavourP.html('  Flavour: ' + card.flavour_text);
  if (setseparate.elt.checked) {
    storageP.html('  Storage: ' + card.getStorageString());
  } else {
    storageP.html('  Storage: ' + card.getStorageString());
  }
  imageDisplay.elt.src = card.imageURL;
  imageDisplay.removeClass('hidden');
  backButton.removeClass('hidden');
  nextButton.addClass('hidden');
  previousButton.addClass('hidden');
  pagelabel.addClass('hidden');
  searchbar.addClass('hidden');
  typesearchbar.addClass('hidden');
  setseparate.addClass('hidden');
  setseparatelabel.addClass('hidden');
  if (isCombined) {
    ownHeader.html('  Count: ' + totalCardCcount);
    foilHeader.html('  Foil Count: ' + totalFoilCount);
    console.log(name);
    console.log(CARDS.COLLECTED[name.toLowerCase()]);
    storageP.html('  Storage: ' + CARDS.COLLECTED[name.toLowerCase()].generic.getStorageString());
  } else { 
    setHeader.html('  Set: ' + card.set);
    ownHeader.html('  Count: ' + card.count);
    foilHeader.html('  Foil Count: ' + card.foil);
    let valueText = '  Value: ' + totalCardCcount
    if (!isNaN(totalFoilCount)) {
      valueText = valueText + ' ($' + totalFoilCount + ')';
    }
    valueP.html(valueText);
    storageP.html('  Storage: ' + card.getStorageString());
  }

}

function updateDisplayRaw(data) {
  if (data.prices == undefined) {
    console.log(data);
  }
  updateDisplay(data.name, data.set, data.collector_number, false, data.prices.usd, data.prices.usd_foil);
}

function updateList(keyword, typekeyword) {
  clearDisplay();
  results = [];
  while(typekeyword.includes('-')) {
    typekeyword = typekeyword.replace('-', '—');
  }
  let cardHolder = CARDS.COLLECTED;
  for (let cname of Object.keys(cardHolder)) {
    let name = cname.toLowerCase();
    if (name.includes(keyword)) {
      if (setseparate.elt.checked) {
        for (let set_code of Object.keys(cardHolder[cname])) {
          if (set_code != 'generic') {
            let set = cardHolder[cname][set_code];
            for (let collector_number of Object.keys(set)) {
              let card = set[collector_number];
              if (card.type.toLowerCase().includes(typekeyword)) {
                results.push(card);
              }
            }
          }
        }
      } else {
        let card = cardHolder[cname].generic;
        if (card.type.toLowerCase().includes(typekeyword)) {
          results.push(card);
        }
      }
    }
  }
  pageMax = Math.ceil(results.length/pageSize);
  if (pageMax < 1) {
    pageMax = 1;
  }
  if (page > pageMax) {
    page = pageMax;
  }
  previousButton.addClass('hidden');
  if (results.length > pageSize) {
    nextButton.removeClass('hidden');
  }
  displayResults();

}

function clearList() {
  let children = listDiv.child();
  for (let i = children.length-1; i > -1; i = i - 1) {
    let elt = children[i];
    elt.remove();
  }
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
