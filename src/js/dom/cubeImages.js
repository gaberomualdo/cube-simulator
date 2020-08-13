const Cube = require('../cube');
const url = require('url');

let cubeBackgroundsInitialized = false;
const originalCubeImageRatio = [600, 400];
const cubeFacesPolygonData = require('./cubeFacesPolygonData');

const cubeColors = {
  green: 'rgb(99, 250, 119)',
  orange: 'rgb(249, 128, 42)',
  blue: 'rgb(58, 194, 254)',
  red: 'rgb(236, 97, 100)',
  white: 'rgb(227, 227, 219)',
  yellow: 'rgb(203, 247, 76)',
};

// cube visualization
const refreshCubeImages = (cube) => {
  const frontViewCanvas = document.querySelector('.cube-image.front-view');
  const backViewCanvas = document.querySelector('.cube-image.back-view');

  clearCanvas(frontViewCanvas);
  clearCanvas(backViewCanvas);

  initializeCubeBackground(frontViewCanvas);
  initializeCubeBackground(backViewCanvas);
  if (!cubeBackgroundsInitialized) {
    cubeBackgroundsInitialized = true;
  }

  const cubePiecesFrontView = getCubePieces(cube, true);
  const cubePiecesBackView = getCubePieces(cube, false);

  cubePiecesFrontView.forEach((faceColor, idx) => {
    drawFaceOnCanvas(frontViewCanvas, idx, faceColor);
  });
  cubePiecesBackView.forEach((faceColor, idx) => {
    drawFaceOnCanvas(backViewCanvas, idx, faceColor);
  });
};

const clearCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const initializeCubeBackground = (canvas) => {
  const ctx = canvas.getContext('2d');
  const bgImg = document.querySelector('.rubiks-cube-background-image');
  const shadowImg = document.querySelector('.rubiks-cube-shadow-image');
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(shadowImg, 0, (-14 / originalCubeImageRatio[1]) * canvas.height, canvas.width, canvas.height);
};

const getCubePieces = (cube, isFrontView) => {
  const cubeFaces = cube.toFacesObj();

  let targetFaces = isFrontView ? [cubeFaces['g'], cubeFaces['r'], cubeFaces['w']] : [cubeFaces['o'], cubeFaces['b'], cubeFaces['y']];

  const cubePieces = [].concat.apply(
    [],
    targetFaces.map(getFaceWithColors).map((face) => {
      return [].concat.apply([], face);
    })
  );
  return cubePieces;
};

const getFaceWithColors = (face) => {
  face.forEach((row, rowIdx) => {
    row.forEach((colorShorthand, colorShorthandIdx) => {
      face[rowIdx][colorShorthandIdx] = cubeColors[Cube.colors[colorShorthand]];
    });
  });

  return face;
};

const drawFaceOnCanvas = (canvas, faceIdx, color) => {
  let vertices = cubeFacesPolygonData[faceIdx];
  vertices = vertices.map((e) => [(e[0] / originalCubeImageRatio[0]) * canvas.width, ((e[1] - 14) / originalCubeImageRatio[1]) * canvas.height]);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  vertices.forEach((i, idx) => {
    if (idx > 0) {
      ctx.lineTo(i[0], i[1]);
    }
  });
  ctx.closePath();
  ctx.fill();
};

let refreshCubeCallback = () => {};

module.exports = {
  refreshCube: (cube) => {
    refreshCubeImages(cube);
    refreshCubeCallback(cube);
  },

  // getters and setters
  setRefreshCubeCallback: (callback) => {
    refreshCubeCallback = callback;
  },
};
