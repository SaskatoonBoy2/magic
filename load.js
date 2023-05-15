
function getElement(id) {
    return document.getElementById(id);
}

function hide(elt) {
    elt.classList.add('hidden');
}

function show(elt) {
    elt.classList.remove('hidden');
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
