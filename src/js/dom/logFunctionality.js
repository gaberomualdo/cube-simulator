const logElm = document.querySelector('.log');
const logItemsElm = document.querySelector('.log .log-items');
const Cube = require('../cube');

const USE_REPEATS = false;

const toFaceView = (moveNotation) => {
  moveNotation = moveNotation.toLowerCase();

  let faceColor;
  switch (moveNotation[0]) {
    case 'f':
      faceColor = 'g';
      break;
    case 'b':
      faceColor = 'b';
      break;
    case 'l':
      faceColor = 'o';
      break;
    case 'r':
      faceColor = 'r';
      break;
    case 'u':
      faceColor = 'w';
      break;
    case 'd':
      faceColor = 'y';
  }

  const clockwise = !(moveNotation[1] && moveNotation[1] === "'");
  let color = Cube.colors[faceColor];
  color = color[0].toUpperCase() + color.slice(1, color.length);

  return `${color} ${clockwise ? /* 'Clockwise' : 'Counterclockwise' */ 'CW' : 'CCW'}`;
};

const generateMoveBadgeHTML = (moveNotation) => {
  moveNotation = moveNotation.toLowerCase();

  let faceColor;
  switch (moveNotation[0]) {
    case 'f':
      faceColor = 'g';
      break;
    case 'b':
      faceColor = 'b';
      break;
    case 'l':
      faceColor = 'o';
      break;
    case 'r':
      faceColor = 'r';
      break;
    case 'u':
      faceColor = 'w';
      break;
    case 'd':
      faceColor = 'y';
  }

  const clockwise = !(moveNotation[1] && moveNotation[1] === "'");
  const badgeColor = Cube.colors[faceColor];

  return `<div class='move-badge ${badgeColor}'><img src='rotate_arrows/${clockwise ? '' : 'counter'}clockwise${
    badgeColor === 'white' || badgeColor === 'yellow' ? '_dark' : ''
  }.png' /></div>`;
};

// repeat util functions

const getLastLogItem = () => {
  const logItems = logItemsElm.querySelectorAll('li:not(.marker)');
  if (logItems.length > 0) {
    return logItems[logItems.length - 1];
  }
  return null;
};

const getLastLogItemNotation = () => {
  const lastItemNotationElm = getLastLogItem().querySelector('span.cube-notation');
  return lastItemNotationElm.innerText.trim();
};

const getLastLogItemRepeatCount = () => {
  const lastItemCountElm = getLastLogItem().querySelector('span.repeat span.count');
  return parseInt(lastItemCountElm.innerText.trim());
};

const addRepeatToLastItem = () => {
  const lastItemCountElm = getLastLogItem().querySelector('span.repeat span.count');
  lastItemCountElm.innerText = getLastLogItemRepeatCount() + 1;
};
const removeRepeatFromLastItem = () => {
  const lastItemCountElm = getLastLogItem().querySelector('span.repeat span.count');
  lastItemCountElm.innerText = getLastLogItemRepeatCount() - 1;
};

// end repeat util functions

const addToLog = (moveNotation, isComputer = false) => {
  if (USE_REPEATS && getLastLogItem() && getLastLogItemNotation() === moveNotation) {
    return addRepeatToLastItem();
  }

  const backgroundURL = `log_icons/${isComputer ? 'computer' : 'human'}.png`;
  const logItem = document.createElement('li');
  logItem.style.backgroundImage = `url(${backgroundURL})`;
  logItem.innerHTML = `${
    USE_REPEATS ? "<span class='repeat'><span class='count'>1</span>&nbsp;×&nbsp;</span>" : ''
  }<span class='cube-notation'>${moveNotation}</span><span class='face-view'>${toFaceView(moveNotation)}</span>${generateMoveBadgeHTML(
    moveNotation
  )}`;
  logItemsElm.appendChild(logItem);
  logElm.scrollTop = logElm.scrollHeight;
};

const addMarkerToLog = (markerText) => {
  const markerElm = document.createElement('li');
  markerElm.innerHTML = `<span>${markerText}</span>`;
  markerElm.classList.add('marker');
  logItemsElm.appendChild(markerElm);
  logElm.scrollTop = logElm.scrollHeight;
};

const popFromLog = () => {
  if (USE_REPEATS && getLastLogItem() && getLastLogItemRepeatCount() > 1) {
    return removeRepeatFromLastItem();
  }

  let toRemove;
  while (!toRemove || toRemove.classList.contains('marker')) {
    toRemove = logItemsElm.querySelector('li:last-child');
    logItemsElm.removeChild(toRemove);
  }
};

const clearLog = () => {
  while (logItemsElm.firstChild) {
    logItemsElm.removeChild(logItemsElm.firstChild);
  }
};

const updateLogMoveCount = (count) => {
  logElm.querySelector('.move-count').innerText = `${count} Moves`;
};

module.exports = { addToLog, popFromLog, addMarkerToLog, clearLog, updateLogMoveCount };
