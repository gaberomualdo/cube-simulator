const VisualizedCube = require('./visualizedCube');
const { getCubeTransitionTimeMS, convertFacesObj } = require('../util');

const transitionTimeMS = getCubeTransitionTimeMS();

let cubeIntialized = false;
let cubeFront;
let cubeBack;
let moveQueue = [];
const moveFromQueue = () => {
  const [face, moveDirection, cubeData] = moveQueue[moveQueue.length - 1];
  cubeFront.moveCubeFace(face, moveDirection, () => {
    cubeFront.cubeData = cubeData;
  });
  cubeBack.moveCubeFace(face, moveDirection, () => {
    cubeBack.cubeData = cubeData;
  });
  setTimeout(() => {
    moveQueue.pop();
    if (moveQueue.length >= 1) {
      moveFromQueue();
    }
  }, transitionTimeMS);
};
const refreshCubeImages = (cube, move, moveCount) => {
  const cubeData = convertFacesObj(cube.toFacesObj());
  if (!cubeIntialized) {
    cubeFront = new VisualizedCube((transitionTimeMS - 50) / 1000, document.querySelector('.cube-image.front-view'), cubeData.clone());
    cubeBack = new VisualizedCube((transitionTimeMS - 50) / 1000, document.querySelector('.cube-image.back-view'), cubeData.clone());
    cubeFront.cubeMirror = cubeBack;
    cubeBack.cubeMirror = cubeFront;
    cubeBack.updateCamera(180, 0);
    cubeIntialized = true;
  }

  if (move === '') {
    cubeFront.cubeData = cubeData;
    cubeFront.resetCube(cubeFront);
    cubeFront.initializeCube();

    cubeBack.cubeData = cubeData;
    cubeBack.resetCube(cubeBack);
    cubeBack.initializeCube();
  } else {
    const moveDirection = move.length === 2 ? moveCount * -1 : moveCount;
    const faces = {
      b: 'back',
      f: 'front',
      r: 'right',
      l: 'left',
      u: 'top',
      d: 'bottom',
    };
    const face = faces[move[0].toLowerCase()];
    moveQueue.unshift([face, moveDirection, cubeData]);
    if (moveQueue.length === 1) {
      moveFromQueue();
    }
  }
};

let refreshCubeCallback = () => {};

module.exports = {
  refreshCube: (cube, move = '', moveCount = 1) => {
    refreshCubeImages(cube, move, moveCount);
    refreshCubeCallback(cube);
  },

  // getters and setters
  setRefreshCubeCallback: (callback) => {
    refreshCubeCallback = callback;
  },

  // enable & disable perspective change
  enablePerspectiveChange: () => {
    cubeFront.enablePerspectiveChange();
    cubeBack.enablePerspectiveChange();
  },
  disablePerspectiveChange: () => {
    cubeFront.disablePerspectiveChange();
    cubeBack.disablePerspectiveChange();
  },
};
