const logElm = document.querySelector('.log');
const logItemsElm = document.querySelector('.log .log-items');
const Cube = require('../cube');

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

const addToLog = (moveNotation, isComputer = false) => {
  const backgroundURL = `log_icons/${isComputer ? 'computer' : 'human'}.png`;
  const logItem = document.createElement('li');
  logItem.style.backgroundImage = `url(${backgroundURL})`;
  logItem.innerHTML = `<span class='cube-notation'>${moveNotation}</span><span class='face-view'>${toFaceView(
    moveNotation
  )}</span>${generateMoveBadgeHTML(moveNotation)}`;
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

module.exports = { addToLog, popFromLog, addMarkerToLog, clearLog };
