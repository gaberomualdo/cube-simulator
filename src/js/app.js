require('regenerator-runtime/runtime');

const Cube = require('./cube');
const solveCube = require('./solve');
const compressMoves = require('./compressMoves');

// cube
const cube = new Cube();

// history
let history = [];

window.addEventListener('load', async () => {
  await refreshCubeImages.refreshCube(cube);
});

// make move and refresh
const refreshCubeImages = require('./dom/refreshCubeImages');

refreshCubeImages.setIsLargeImage(true);
refreshCubeImages.setVisualizerServerURL('http://localhost:6556/api/');

const makeMoveAndRefreshImage = async (moveNotation) => {
  cube.makeMove(moveNotation);
  history.push(moveNotation);
  await refreshCubeImages.refreshCube(cube);
};

// openable section DOM for open and close events
require('./dom/openableSection');

// misc buttons
require('./dom/miscButtons')(Cube, cube, refreshCubeImages, solveCube, compressMoves, history);

// move buttons
require('./dom/moveButtons')(makeMoveAndRefreshImage);
