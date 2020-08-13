require('regenerator-runtime/runtime');

const Cube = require('./cube');
const solveCube = require('./solve');
const compressMoves = require('./compressMoves');

// cube
const cube = new Cube();

// history
let history = [];

window.addEventListener('load', () => {
  cubeImages.refreshCube(cube);
});

// make move and refresh
const cubeImages = require('./dom/cubeImages');

const makeMoveAndRefreshImage = (moveNotation) => {
  cube.makeMove(moveNotation);
  history.push(moveNotation);
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

miscButtons.solveButton.addEventListener('click', () => {
  miscButtons.solve(Cube, cube, cubeImages, solveCube, compressMoves, history);
});
miscButtons.scrambleButton.addEventListener('click', () => {
  miscButtons.scramble(cube, cubeImages, history);
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
