const Cube = require('../cube');
const colors = ['green', 'red', 'white', 'orange', 'blue', 'yellow'];

const isFocused = (element) => {
  return element === document.activeElement;
};

colors.forEach((color, ind) => {
  const face = document.querySelector(
    `.container .set-pieces .content .faces-row:nth-child(${Math.floor(ind / 3) + 1}) .face:nth-child(${(ind % 3) + 1})`
  );
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
  });
});

const toShorthand = (color) => {
  return Object.keys(Cube.colors)[Object.values(Cube.colors).indexOf(color)];
};
const toFullName = (color) => {
  return Cube.colors[color];
};

// function to update piece colors
module.exports = {
  initPieceButtons: (setCubePiece) => {
    colors.forEach((faceColor, ind) => {
      const face = document.querySelector(
        `.container .set-pieces .content .faces-row:nth-child(${Math.floor(ind / 3) + 1}) .face:nth-child(${(ind % 3) + 1})`
      );
      face.querySelectorAll('.piece').forEach((piece, pieceInd) => {
        // onclick, change piece color
        piece.addEventListener('click', async () => {
          const pieceColor = piece.getAttribute('color').toString();
          if (pieceColor) {
            // change piece color in DOM
            const newColor = colors[(colors.indexOf(pieceColor) + 1) % colors.length];

            // change piece color in cube
            const shorthandFaceColor = toShorthand(faceColor);
            let pieceRow = Math.floor(pieceInd / 3);
            let pieceCol = pieceInd % 3;

            // calculate piece position on cube
            const finalPiecePos = { x: -1, y: -1, z: -1 };

            // first, find axis value of the face the piece is on
            let faceAxis = '';
            Object.values(Cube.faces).forEach((axisValues, axisInd) => {
              const axis = Object.keys(Cube.faces)[axisInd];
              if (axisValues.start === shorthandFaceColor) {
                finalPiecePos[axis] = 0;
              } else if (axisValues.end === shorthandFaceColor) {
                finalPiecePos[axis] = 2;
              } else {
                return;
              }
              faceAxis = axis;
            });

            // transform row and col with presets to fix orientation problems
            if (shorthandFaceColor === 'o' || shorthandFaceColor === 'b') {
              pieceRow = 2 - pieceRow;
            } else if (shorthandFaceColor === 'y') {
              [pieceRow, pieceCol] = [pieceCol, pieceRow];
              pieceRow = 2 - pieceRow;
              pieceCol = 2 - pieceCol;
            }

            // more presets
            if (faceAxis === 'z') {
              finalPiecePos.y = 2 - pieceRow;
              finalPiecePos.x = pieceCol;
            } else if (faceAxis === 'y') {
              finalPiecePos.z = 2 - pieceRow;
              finalPiecePos.x = pieceCol;
            } else if (faceAxis === 'x') {
              finalPiecePos.y = 2 - pieceRow;
              finalPiecePos.z = pieceCol;
            }

            await setCubePiece(finalPiecePos.x, finalPiecePos.y, finalPiecePos.z, faceAxis, toShorthand(newColor));
          }
        });
      });
    });
  },
  updatePieces: (cubeFaces) => {
    colors.forEach((color, ind) => {
      const faceElm = document.querySelector(
        `.container .set-pieces .content .faces-row:nth-child(${Math.floor(ind / 3) + 1}) .face:nth-child(${(ind % 3) + 1})`
      );

      // convert from color to color shorthand with Cube.colors object
      const faceColors = cubeFaces[toShorthand(color)];

      faceElm.querySelectorAll('.piece').forEach((piece, ind) => {
        const colorShorthand = faceColors[Math.floor(ind / 3)][ind % 3];

        piece.setAttribute('color', toFullName(colorShorthand));
      });
    });
  },
};
