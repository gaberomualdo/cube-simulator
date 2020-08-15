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

module.exports = { getDescriptionForMove };
