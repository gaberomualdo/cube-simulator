const solveCube = require('../solve');
const Cube = require('../cube');
const VisualizedCube = require('../dom/visualizedCube');
const CubeAreaComponent = require('../dom/cubeAreaComponent');
const SetPiecesComponent = require('../dom/setPiecesComponent');
const { convertFacesObj, getCubeTransitionTimeMS } = require('../util');

const transitionTimeMS = getCubeTransitionTimeMS();

const sectionElm = document.querySelector('.page.solver .second-column > .moves');

let cubeIntialized = false;
let cubeVisualized;
let cubeArea;

const colors = {
  f: 'green',
  b: 'blue',
  l: 'orange',
  r: 'red',
  u: 'white',
  d: 'yellow',
};

const toSolve = new Cube();
const setPieces = new SetPiecesComponent(document.querySelector('.page.solver .set-pieces > .content'), (x, y, z, key, newVal) => {
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
    cubeVisualized = new VisualizedCube(
      (transitionTimeMS - 50) / 1000,
      document.querySelector('.page.solver .cube-area-component > .center-cube'),
      cubeData.clone()
    );
    cubeIntialized = true;
  }

  cubeVisualized.cubeData = cubeData;
  cubeVisualized.resetCube(cubeVisualized);
  cubeVisualized.initializeCube();
};

updatePieces(setPieces, toSolve);
refreshCubeImages(toSolve);

const newSolve = () => {
  sectionElm.innerHTML = '';

  const cube = toSolve;
  const initialCubeData = convertFacesObj(cube.toFacesObj());

  const moves = [];

  solveCube(cube, (notation, isLastMove) => {
    cube.makeMove(notation);

    const cubeData = convertFacesObj(cube.toFacesObj());
    moves.push({
      notation,
      cubeData,
    });

    if (isLastMove) {
      moves.forEach((e, i) => {
        const color = colors[e.notation[0].toLowerCase()];
        const moveHTML = `<span class='number'>${i + 1}.</span>
          <span class='notation'>${e.notation}&nbsp;</span>
          <span class='face-view'>&bull; ${color} ${e.notation.length === 2 ? 'C' : ''}CW</span>
          <div class="move-badge ${color}"><img src="rotate_arrows/${e.notation.length === 2 ? 'counter' : ''}clockwise${
          color === 'white' || color === 'yellow' ? '_dark' : ''
        }.png"></div>`;
        sectionElm.innerHTML += `
          <div class="move-container" data-idx="${i}">
            <div class="move-cube"></div>
            <div class="info">${moveHTML}</div>
          </div>
          `;
      });
      // set up cubes on the right
      sectionElm.querySelectorAll('.move-container').forEach((e, i) => {
        const moveCubeElm = e.querySelector('.move-cube');
        new VisualizedCube((transitionTimeMS - 50) / 1000, moveCubeElm, moves[i].cubeData);
      });

      if (cubeArea && !cubeArea.isRemoved()) {
        cubeArea.remove();
      }
      cubeArea = new CubeAreaComponent(document.querySelector('.page.solver .cube-area-component'));
      cubeArea.initialize(moves, initialCubeData, 'solver', false);

      document.querySelector('.page.solver > .inner').classList.add('solving');
      solveBtn.innerHTML = '&larr;&nbsp; Solve Another Cube';

      solveBtn.classList.remove('loading');
    }
  });
};

const solveBtn = document.querySelector('.page.solver .new-scramble');

solveBtn.addEventListener('click', () => {
  solveBtn.classList.add('loading');
  if (document.querySelector('.page.solver > .inner').classList.contains('solving')) {
    window.location.reload();
  }
  solveBtn.blur();
  setTimeout(() => {
    newSolve();
  }, 100); // solving adds blocking time so this additional time is to render the loading time to improve UX slightly.
});
