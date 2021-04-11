const Cube = require('./cube');
const solveCube = require('./solve');
const compressMoves = require('./compressMoves');

// log
const { addToLog, popFromLog, addMarkerToLog, clearLog, updateLogMoveCount } = require('./dom/logFunctionality');

// history
const History = require('./history');
let history = new History(() => updateLogMoveCount(history.length()), addToLog, popFromLog);

// clear log
document.querySelector('.log .clear-log').addEventListener('click', (e) => {
  history.clear();
  clearLog();
  e.target.blur();
});

// cube
const cube = new Cube();

// init cube image on load
window.addEventListener('load', () => {
  cubeImages.refreshCube(cube);
});

// make move and refresh
const cubeImages = require('./dom/cubeImages');

const makeMoveAndRefreshImage = (moveNotation) => {
  cube.makeMove(moveNotation);
  history.add(moveNotation);
  cubeImages.refreshCube(cube, moveNotation);
};

// openable section DOM for open and close events
require('./dom/openableSection');

// nav
require('./dom/nav');

// set pieces section
const SetPiecesComponent = require('./dom/setPiecesComponent');
const simulatorPieces = new SetPiecesComponent(document.querySelector('.container .set-pieces .content'), (x, y, z, key, newVal) => {
  cube.cube[x][y][z][key] = newVal;
  cubeImages.refreshCube(cube);
});

cubeImages.setRefreshCubeCallback((cube) => {
  simulatorPieces.updatePieces(cube.toFacesObj());
});

// misc buttons
const miscButtons = require('./dom/miscButtons')();

let solving = false;
let scrambling = false;

miscButtons.solveButton.addEventListener('click', async () => {
  miscButtons.solveButton.blur();
  if (!solving && !scrambling) {
    solving = true;
    miscButtons.solveButton.classList.add('loading');
    addMarkerToLog('Begin Solve');
    setTimeout(async () => {
      await miscButtons.solve(Cube, cube, cubeImages, solveCube, compressMoves, history, (solveMoves) => {
        addMarkerToLog(`End Solve (${solveMoves} moves)`);
        solving = false;
        miscButtons.solveButton.classList.remove('loading');
      });
    }, 150); // add some additional time to make sure the loading animation is rendered in time. The solving system creates JavaScript blocking time since it doesn't use a worker, so this is necessary for better UX.
  }
});
miscButtons.scrambleButton.addEventListener('click', async () => {
  miscButtons.scrambleButton.blur();
  if (!scrambling && !solving) {
    scrambling = true;
    miscButtons.scrambleButton.classList.add('loading');
    addMarkerToLog('Start Scramble');
    await miscButtons.scramble(cube, cubeImages, history);
    addMarkerToLog('End Scramble (20 moves)');
    miscButtons.scrambleButton.classList.remove('loading');
    scrambling = false;
  }
});
miscButtons.undoButton.addEventListener('click', () => {
  miscButtons.undoButton.blur();
  miscButtons.undo(cube, cubeImages, history);
});

// move buttons
require('./dom/moveButtons')(makeMoveAndRefreshImage);

// log toggle open
import './dom/logOpenToggle';

// log functionality
import './dom/logFunctionality';

// notation type toggle functionality
import './dom/toggleNotation';

// page functionality
const { getPage, setPage } = require('./pagesFunctionality');
global.getPage = getPage;
global.setPage = setPage;

// pages
require('./pages/scrambler');
require('./pages/solver');
require('./pages/learn');
require('./pages/about');

// stopwatch
import './dom/stopwatch';
