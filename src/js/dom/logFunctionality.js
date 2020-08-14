const logItemsElm = document.querySelector('.log .log-items');

const addToLog = (moveNotation, isComputer = false) => {
  const backgroundURL = `log_icons/${isComputer ? 'computer' : 'human'}.png`;
  const logItem = document.createElement('li');
  logItem.style.backgroundImage = `url(${backgroundURL})`;
  logItem.innerText = moveNotation;
  logItemsElm.appendChild(logItem);
};

const popFromLog = () => {
  const toRemove = logItemsElm.querySelector('li:last-child');
  logItemsElm.removeChild(toRemove);
};

module.exports = { addToLog, popFromLog };
