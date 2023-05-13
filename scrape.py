
import urllib.request
import json
from itertools import chain
def getCardData(setCode, num):
    with urllib.request.urlopen('https://api.scryfall.com/cards/' + setCode + '/'+str(num)) as response:
       data = response.read()
    
    return json.loads(data)

def scrapeSingleCard(uuidcode, tcode):
    data = getCardData(uuidcode, tcode)
    uuid = data.get('id')
    converted_mana_cost = str(data.get('cmc'))
    mana_cost = str(data.get('mana_cost'))
    type_line = data.get('type_line')
    text = data.get('oracle_text')
    if text == None:
        text = '';
    text = text.replace('\n','\\n').replace('"', '\\"')
    colours = json.dumps(data.get('colors')).replace('"', '\\"')
    set_code = uuidcode
    collector_number = str(tcode)
    rarity = data.get('rarity')
    flavour_text = data.get('flavour_text')
    if flavour_text == None:
        flavour_text = '';
    flavour_text = flavour_text.replace('\n','\\n').replace('"', '\\"')
    keywords = json.dumps(data.get('keywords')).replace('"', '\\"')
    power = data.get('power')
    if power == None:
        power = '';
    toughness = data.get('toughness')
    if toughness == None:
        toughness = '';
    image = data.get('image_uris')
    if image == None:
        image = data.get('card_faces')[0].get('image_uris')
    image = image.get('large')
    name = data.get('name')
    content = 'new Card("'+uuid+'","'+set_code+'","'+name+'","'+colours+'","'+type_line+'","'+rarity+'","'+image+'","'+collector_number+'","'+mana_cost+'",'+converted_mana_cost+',"'+text+'","'+flavour_text+'","'+power+'","'+toughness+'", 0, 0)\n'
    file = open('cards.js', 'a')
    file.write(content)
    file.close()

lettereds = [[]]
letterss = [[]]
sets = ['dde']
counts = [71]
#scrapeSingleCard('m21', '342')
for j in range(len(sets)):
    content = ''
    uuidcode = sets[j]
    card_count = counts[j]
    lettered = []
    letters = []
    if j < len(lettereds):
        lettered = lettereds[j]
        letters = letterss[j]
    print('running ' + uuidcode)
    for code in range(card_count):
        fcode = code+1
        codes = []
        if (fcode in lettered):
            if letters[lettered.index(fcode)] != None:
                for char in letters[lettered.index(fcode)]:
                    codes.append(str(fcode)+char)
        else:
            codes = [fcode]
        for tcode in codes:
            print(tcode)
            data = getCardData(uuidcode, tcode)
            uuid = data.get('id')
            converted_mana_cost = str(data.get('cmc'))
            mana_cost = str(data.get('mana_cost'))
            type_line = data.get('type_line')
            text = data.get('oracle_text')
            if text == None:
                text = '';
            text = text.replace('\n','\\n').replace('"', '\\"')
            colours = json.dumps(data.get('colors')).replace('"', '\\"')
            set_code = uuidcode
            collector_number = str(tcode)
            rarity = data.get('rarity')
            flavour_text = data.get('flavour_text')
            if flavour_text == None:
                flavour_text = '';
            flavour_text = flavour_text.replace('\n','\\n').replace('"', '\\"')
            keywords = json.dumps(data.get('keywords')).replace('"', '\\"')
            power = data.get('power')
            if power == None:
                power = '';
            toughness = data.get('toughness')
            if toughness == None:
                toughness = '';
            image = data.get('image_uris')
            if image == None:
                image = data.get('card_faces')[0].get('image_uris')
            image = image.get('large')
            name = data.get('name')
            content = content + 'new Card("'+uuid+'","'+set_code+'","'+name+'","'+colours+'","'+type_line+'","'+rarity+'","'+image+'","'+collector_number+'","'+mana_cost+'",'+converted_mana_cost+',"'+text+'","'+flavour_text+'","'+power+'","'+toughness+'", 0, 0)\n'
            
    file = open('cards.js', 'a')
    file.write(content)
    file.close()


    print('done')
