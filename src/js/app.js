const Cube = require('./cube');
const solveCube = require('./solve');
const compressMoves = require('./compressMoves');

// log
const { addToLog, popFromLog, addMarkerToLog, clearLog } = require('./dom/logFunctionality');

// history
const History = require('./history');
let history = new History(addToLog, popFromLog);

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
  cubeImages.refreshCube(cube);
};

// openable section DOM for open and close events
require('./dom/openableSection');

// set pieces section
const { updatePieces, initPieceButtons } = require('./dom/setPieces');

initPieceButtons((x, y, z, key, newVal) => {
  cube.cube[x][y][z][key] = newVal;
  cubeImages.refreshCube(cube);
});

cubeImages.setRefreshCubeCallback((cube) => {
  updatePieces(cube.toFacesObj());
});

// misc buttons
const miscButtons = require('./dom/miscButtons')();

let solving = false;
let scrambling = false;

miscButtons.solveButton.addEventListener('click', async () => {
  if (!solving) {
    solving = true;
    addMarkerToLog('Begin Solve');
    await miscButtons.solve(Cube, cube, cubeImages, solveCube, compressMoves, history, (solveMoves) => {
      addMarkerToLog(`End Solve (${solveMoves} moves)`);
      solving = false;
    });
  }
});
miscButtons.scrambleButton.addEventListener('click', async () => {
  if (!scrambling) {
    scrambling = true;
    addMarkerToLog('Start Scramble');
    await miscButtons.scramble(cube, cubeImages, history);
    addMarkerToLog('End Scramble (50 moves)');
    scrambling = false;
  }
});
miscButtons.undoButton.addEventListener('click', () => {
  miscButtons.undo(cube, cubeImages, history);
});

// move buttons
require('./dom/moveButtons')(makeMoveAndRefreshImage);

// log toggle open
import './dom/logOpenToggle';

// log functionality
import './dom/logFunctionality';
