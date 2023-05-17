
const list = {}
list.div = getElement('listDiv');
list.items = [];

const settings = {};
settings.separateSetsCheckbox = getElement('separateSetsCheckbox');
settings.nameBar = getElement('nameBar');
settings.typeBar = getElement('typeBar');
settings.advancedDiv = getElement('advancedDiv');
settings.advancedButton = getElement('advancedButton');
settings.commonIncludeCheckbox = getElement('commonIncludeCheckbox');
settings.uncommonIncludeCheckbox = getElement('uncommonIncludeCheckbox');
settings.rareIncludeCheckbox = getElement('rareIncludeCheckbox');
settings.mythicIncludeCheckbox = getElement('mythicIncludeCheckbox');
settings.commonMinCount = getElement('commonMinCount');
settings.uncommonMinCount = getElement('uncommonMinCount');
settings.rareMinCount = getElement('rareMinCount');
settings.mythicMinCount = getElement('mythicMinCount');

settings.getSearchValues = function() {
    let values = {};
    values.keywords = {};
    values.keywords.name = settings.nameBar.value.toLowerCase();
    values.keywords.type = settings.typeBar.value.toLowerCase();
    for (let index of Object.keys(values.keywords)) {
        let keyword = values.keywords[index];
        while(keyword.includes('-')) {
            keyword = keyword.replace('-', '—');
        }
        values.keywords[index] = keyword;
    }
    values.cardHolder = cards.collected;
    values.separateSets = settings.separateSetsCheckbox.checked;
    values.raritesIncluded = [];
    values.minCounts = {};
    values.minCounts.common = settings.commonMinCount.value;
    values.minCounts.uncommon = settings.uncommonMinCount.value;
    values.minCounts.rare = settings.rareMinCount.value;
    values.minCounts.mythic = settings.mythicMinCount.value;
    if (settings.commonIncludeCheckbox.checked) {
        values.raritesIncluded.push('common');
    }
    if (settings.uncommonIncludeCheckbox.checked) {
        values.raritesIncluded.push('uncommon');
    }
    if (settings.rareIncludeCheckbox.checked) {
        values.raritesIncluded.push('rare');
    }
    if (settings.mythicIncludeCheckbox.checked) {
        values.raritesIncluded.push('mythic');
    }
    return values;
}

list.show = function() {
    display.clear();
    show(settings.advancedButton);
    show(settings.nameBar);
    show(settings.typeBar);
    show(display.nextButton);
    show(display.previousButton);
    show(display.pageLabel);
}

list.createStatsItem = function() {
    list.createItem('Statistics', 'stats.show();');
}

list.createItem = function(displayText, code) {
    let link = document.createElement('a'); 
    link.innerText = displayText;
    link.setAttribute('onclick', code);
    link.href = '#';
    list.div.appendChild(link);
}

list.clear = function() {
    let children = listDiv.children;
    for (let i = children.length-1; i > -1; i = i - 1) {
      let elt = children[i];
      elt.remove();
    }
}

function searchUpdate() {
    list.updateSearch();
}

list.updateSearch = function() {
  list.items = [];
  let searchSettings = settings.getSearchValues();
  for (let cardName of Object.keys(searchSettings.cardHolder)) {
    let indexName = cardName.toLowerCase();
    if (indexName.includes(searchSettings.keywords.name)) {
      if (searchSettings.separateSets) {
        for (let set_code of Object.keys(cardHolder[cardName])) {
          if (set_code != 'generic') {
            let set = searchSettings.cardHolder[cardName][set_code];
            for (let collector_number of Object.keys(set)) {
              let card = set[collector_number];
              if (searchSettings.raritesIncluded.includes(card.rarity.toLowerCase())) {
                if (searchSettings.minCounts[card.rarity.toLowerCase()] <= card.count) {
                    if (card.type.toLowerCase().includes(searchSettings.keywords.type)) {
                        list.items.push(card);
                    }
                }
              }
            }
          }
        }
      } else {
        let card = searchSettings.cardHolder[cardName].generic;
        if (searchSettings.raritesIncluded.includes(card.rarity.toLowerCase())) {
          if (searchSettings.minCounts[card.rarity.toLowerCase()] <= card.count) {
              if (card.type.toLowerCase().includes(searchSettings.keywords.type)) {
                  list.items.push(card);
              }
          }
        }
      }
    }
  }
  display.maxPage = Math.ceil(list.items.length/display.pageSize);
  if (display.maxPage < 1) {
    display.maxPage = 1;
  }
  if (display.currentPage > display.maxPage) {
    display.currentPage = display.maxPage;
  }
  hide(display.previousButton);
  if (list.items.length > display.pageSize) {
    show(display.nextButton);
  }
  list.display();

}

list.display = function() {
  list.clear();
  display.pageLabel.innerText = 'Page ' + display.currentPage + ' of ' + display.maxPage;
  if (display.currentPage == 1) {
    hide(display.previousButton);
  } else {
    show(display.previousButton);
  }
  if (display.currentPage == display.maxPage) {
    hide(display.nextButton);
  } else {
    show(display.nextButton);
  }
  let start = (display.currentPage-1)*display.pageSize;
  let end = display.currentPage*display.pageSize;
  if (end > list.items.length) {
    end = list.items.length;
  }
  list.createStatsItem();
  for (let index = start; index < end; index = index + 1) {
    let card = list.items[index];
    let name = card.name;
    let set = card.getSet();
    let set_code = card.getSetCode();
    let collector_number = card.getCollectorNumber();
    let count = card.count;
    let foil = card.foil;
    let displayText = name + ' ('+set+') ['+count+']';
    if (!settings.separateSetsCheckbox.checked) {
      displayText = name + ' ['+count+']';
    }
    let convertedname = '';
    let chars = ['\'', '\"']; 
    for (let char of name) {
      if (chars.includes(char)) {
        convertedname = convertedname + '\\';
      }
      convertedname = convertedname + char;
    }
    let code = 'list.clear(); display.showCard(\''+convertedname+'\', \''+set_code+'\', '+collector_number+', true, '+count+', '+foil+');';
    list.createItem(displayText, code);
  }
}