const Cube = require('./cube');

const getDescriptionForMove = (moveNotation) => {
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

  let clockwise = !(moveNotation[1] && moveNotation[1] === "'");

  return Cube.colors[faceColor] + ` ${clockwise ? '' : 'counter'}clockwise`;
};

const getCubeTransitionTimeMS = () => {
  return 250;
};

const rotateFace = (matrix) => {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
  matrix.length = 0;
  matrix.push(...result);
  return matrix;
};

const convertFacesObj = (faces) => {
  const colorReplacements = {
    b: 'blue',
    g: 'green',
    r: 'red',
    o: 'orange',
    w: 'white',
    y: 'yellow',
  };
  const faceReplacements = {
    b: 'back',
    g: 'front',
    r: 'right',
    o: 'left',
    w: 'top',
    y: 'bottom',
  };
  const newFaces = {};
  ['b', 'g', 'r', 'o', 'w', 'y'].forEach((k) => {
    let newFace = faces[k].map((e) => {
      return e.map((c) => colorReplacements[c]);
    });
    if (k === 'o' || k === 'b') {
      newFace = rotateFace(rotateFace(newFace));
    } else if (k === '' || k === 'y') {
      newFace = rotateFace(newFace);
    }
    newFaces[faceReplacements[k]] = newFace;
  });
  return newFaces;
};

module.exports = { getDescriptionForMove, getCubeTransitionTimeMS, convertFacesObj };
