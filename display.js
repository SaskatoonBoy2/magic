
const display = {}
display.currentPage = 1;
display.maxPage = 1;
display.pageSize = 50;
display.nextButton = getElement('nextButton');
display.previousButton = getElement('previousButton');
display.backButton = getElement('backButton');
display.pageLabel = getElement('pageLabel');
display.nameHeader = getElement('nameHeader');
display.setHeader = getElement('setHeader');
display.colourHeader = getElement('colourHeader');
display.rarityHeader = getElement('rarityHeader');
display.typeHeader = getElement('typeHeader');
display.countHeader = getElement('countHeader');
display.foilHeader = getElement('foilHeader');
display.valueParagraph = getElement('valueParagraph');
display.textParagraph = getElement('textParagraph');
display.flavourParagraph = getElement('flavourParagraph');
display.storageParagraph = getElement('storageParagraph');
display.image = getElement('image');
display.statsPageOpen = false;

display.advancedSearch = function() {
    display.clear()
    show(settings.advancedDiv);
}

display.nextPage = function(){
  if (display.page < display.maxPage) {
    display.page += 1;
    list.update();
    if (display.page == display.maxPage) {
      hide(display.nextButton);
    }
    if (page > 1) {
      show(display.previousButton);
    }
  }
}

display.previousPage = function() {
  if (display.page > 1) {
    display.page -= 1;
    list.update();
    if (display.page == 1) {
        hide(display.previousButton);
    } 
    if (display.page == display.maxPage-1) {
        hide(display.nextButton);
    }
  }
}

display.clear = function() {
    hide(display.nextButton);
    hide(display.previousButton);
    hide(display.backButton);
    hide(display.pageLabel);
    hide(display.image);
    hide(settings.nameBar);
    hide(settings.typeBar);
    hide(settings.advancedDiv);
    hide(settings.advancedButton);
    list.clear();
    display.nameHeader.innerText = '';
    display.setHeader.innerText = '';
    display.colourHeader.innerText = '';
    display.rarityHeader.innerText = '';
    display.typeHeader.innerText = '';
    display.countHeader.innerText = '';
    display.foilHeader.innerText = '';
    display.valueParagraph.innerText = '';
    display.textParagraph.innerText = '';
    display.flavourParagraph.innerText = '';
    display.storageParagraph.innerText = '';
    display.image.src = '';
    display.statsPageOpen = false;
}

display.showCard = function(name, set_code, collector_number, isCombined, totalCardCcount, totalFoilCount) {
  let card = cards.get(name.toLowerCase(),set_code,collector_number);
  display.nameHeader.innerHTML = card.name;
  display.colourHeader.innerHTML = '  Colour: ' + card.colours;
  display.rarityHeader.innerHTML = '  Rarity: ' + card.rarity;
  display.typeHeader.innerHTML = '  Type: ' + card.type;
  display.textParagraph.innerHTML = '  Text: ' + card.text;
  display.flavourParagraph.innerHTML = '  Flavour: ' + card.flavour_text;
  if (settings.separateSetsCheckbox.checked) {
    display.storageParagraph.innerHTML = '  Storage: ' + card.getStorageString();
  } else {
    display.storageParagraph.innerHTML = '  Storage: ' + card.getStorageString();
  }
  display.image.src = card.imageURL;
  show(display.image);
  show(display.backButton);
  hide(display.nextButton);
  hide(display.previousButton);
  hide(display.pageLabel);
  hide(settings.nameBar);
  hide(settings.typeBar);
  hide(settings.advancedDiv);
  hide(settings.advancedButton);
  if (isCombined) {
    display.countHeader.innerHTML = '  Count: ' + totalCardCcount;
    display.foilHeader.innerHTML = '  Foil Count: ' + totalFoilCount;
    display.storageParagraph.innerHTML = '  Storage: ' + cards.collected[name.toLowerCase()].generic.getStorageString();
  } else { 
    display.setHeader.innerHTML = '  Set: ' + card.set;
    display.countHeader.innerHTML = '  Count: ' + card.count;
    display.foilHeader.innerHTML = '  Foil Count: ' + card.foil;
    let valueText = '  Value: ' + totalCardCcount
    if (!isNaN(totalFoilCount)) {
      valueText = valueText + ' ($' + totalFoilCount + ')';
    }
    display.valueParagraph.innerHTML = valueText;
    display.storageParagraph.innerHTML = '  Storage: ' + card.getStorageString();
  }

}