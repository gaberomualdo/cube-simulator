const Cube = require('../cube');
const VisualizedCube = require('../dom/visualizedCube');
const CubeAreaComponent = require('../dom/cubeAreaComponent');
const SetPiecesComponent = require('../dom/setPiecesComponent');
const { convertFacesObj, getCubeTransitionTimeMS } = require('../util');

const transitionTimeMS = getCubeTransitionTimeMS();

let cubeIntialized = false;
let cubeFront;
let cubeBack;

const colors = {
  f: 'green',
  b: 'blue',
  l: 'orange',
  r: 'red',
  u: 'white',
  d: 'yellow',
};

const toSolve = new Cube();
const setPieces = new SetPiecesComponent(document.querySelector('.page.solver > .create-cube > .set-pieces > .content'), (x, y, z, key, newVal) => {
  toSolve.cube[x][y][z][key] = newVal;
  refreshCubeImages(toSolve);
  updatePieces(setPieces, toSolve);
});

const updatePieces = (setPieces, cube) => {
  setPieces.updatePieces(cube.toFacesObj());
};

const refreshCubeImages = (cube) => {
  const cubeData = convertFacesObj(cube.toFacesObj());
  if (!cubeIntialized) {
    cubeFront = new VisualizedCube(
      (transitionTimeMS - 50) / 1000,
      document.querySelector('.page.solver > .create-cube > .cube-row > .cube-col.front > .cube'),
      cubeData.clone()
    );
    cubeBack = new VisualizedCube(
      (transitionTimeMS - 50) / 1000,
      document.querySelector('.page.solver > .create-cube > .cube-row > .cube-col.back > .cube'),
      cubeData.clone()
    );
    cubeFront.cubeMirror = cubeBack;
    cubeBack.cubeMirror = cubeFront;
    cubeBack.updateCamera(180, 0);
    cubeIntialized = true;
  }

  cubeFront.cubeData = cubeData;
  cubeFront.resetCube(cubeFront);
  cubeFront.initializeCube();

  cubeBack.cubeData = cubeData;
  cubeBack.resetCube(cubeBack);
  cubeBack.initializeCube();
};

updatePieces(setPieces, toSolve);
refreshCubeImages(toSolve);

const newScramble = () => {
  scrambleSectionElm.innerHTML = '';

  const cube = new Cube();
  const initialCubeData = convertFacesObj(cube.toFacesObj());

  let amountOfMoves = parseInt(movesInputElm.value);
  if (!(amountOfMoves > 0 && amountOfMoves < 1000)) {
    amountOfMoves = 20;
    movesInputElm.value = amountOfMoves;
  }

  const scrambleMoves = [];

  cube.scramble(amountOfMoves, async (notation) => {
    const cubeData = convertFacesObj(cube.toFacesObj());
    scrambleMoves.push({
      notation,
      cubeData,
    });

    if (scrambleMoves.length === amountOfMoves) {
      scrambleMoves.forEach((e, i) => {
        const color = colors[e.notation[0].toLowerCase()];
        const moveHTML = `<span class='number'>${i + 1}.</span>
          <span class='notation'>${e.notation}&nbsp;</span>
          <span class='face-view'>&bull; ${color} ${e.notation.length === 2 ? 'C' : ''}CW</span>
          <div class="move-badge ${color}"><img src="rotate_arrows/${e.notation.length === 2 ? 'counter' : ''}clockwise${
          color === 'white' || color === 'yellow' ? '_dark' : ''
        }.png"></div>`;
        scrambleSectionElm.innerHTML += `
          <div class="move-container" data-idx="${i}">
            <div class="move-cube"></div>
            <div class="info">${moveHTML}</div>
          </div>
          `;
      });
      // set up cubes on the right
      scrambleSectionElm.querySelectorAll('.move-container').forEach((e, i) => {
        const moveCubeElm = e.querySelector('.move-cube');
        const moveCube = new VisualizedCube((transitionTimeMS - 50) / 1000, moveCubeElm, scrambleMoves[i].cubeData);
      });

      const cubeArea = new CubeAreaComponent(document.querySelector('.page.solver .cube-area-component'));
      cubeArea.initialize(scrambleMoves, initialCubeData, 'scrambler');
    }
  });
};
