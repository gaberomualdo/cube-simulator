const Cube = require('../cube');
const colors = ['green', 'red', 'blue', 'orange', 'white', 'yellow'];

const isFocused = (element) => {
  return element === document.activeElement;
};

colors.forEach((color, ind) => {
  const face = document.querySelector(`.set-pieces .content .faces-row:nth-child(${Math.floor(ind / 3) + 1}) .face:nth-child(${(ind % 3) + 1})`);
  face.querySelectorAll('.piece').forEach((piece, ind) => {
    // disable center piece
    if (ind === 4) {
      piece.setAttribute('disabled', 'true');
    }

    // if focused, blur after a certain amount of time
    piece.addEventListener('focus', function () {
      setTimeout(() => {
        if (isFocused(this)) {
          this.blur();
        }
      }, 150);
    });

    // onclick, change piece color
    piece.addEventListener('click', async () => {
      const pieceColor = piece.getAttribute('color');
      if (pieceColor) {
        const newColor = colors[(colors.indexOf(pieceColor) + 1) % colors.length];
        piece.setAttribute('color', newColor);
      }
    });
  });
});

const toShorthand = (color) => {
  return Object.keys(Cube.colors)[Object.values(Cube.colors).indexOf(color)];
};
const toFullName = (color) => {
  return Cube.colors[color];
};

// function to update piece colors
module.exports = (cubeFaces) => {
  colors.forEach((color, ind) => {
    const faceElm = document.querySelector(`.set-pieces .content .faces-row:nth-child(${Math.floor(ind / 3) + 1}) .face:nth-child(${(ind % 3) + 1})`);

    // convert from color to color shorthand with Cube.colors object
    const faceColors = cubeFaces[toShorthand(color)];

    faceElm.querySelectorAll('.piece').forEach((piece, ind) => {
      const colorShorthand = faceColors[Math.floor(ind / 3)][ind % 3];

      piece.setAttribute('color', toFullName(colorShorthand));
    });
  });
};
