const Cube = require('./cube');

// solve function
module.exports = (cube, makeMoveWithNotation) => {
  // check if the piece moves (is not a center piece of a face)
  const isMovable = (piece) => {
    const axes = Object.keys(piece);

    return axes.length > 1;
  };

  // face to Rubik's cube notation
  const toNotation = (face, clockwise = true) => {
    const facesAndNotation = {
      g: 'F',
      b: 'B',
      r: 'R',
      o: 'L',
      w: 'U',
      y: 'D',
    };

    if (facesAndNotation[face]) {
      return `${facesAndNotation[face]}${clockwise ? '' : "'"}`;
    } else {
      throw new Error(`Invalid face color with letter ${face}`);
    }
  };

  // get face from axis and position in axis
  const toFaceFromAxis = (axis, axisPos) => {
    const axisWithFaces = Cube.faces[axis];

    if (!axisWithFaces) {
      throw new Error(`Invalid axis ${axis}`);
    }

    if (axisPos == 0) {
      return axisWithFaces.start;
    } else if (axisPos == 2) {
      return axisWithFaces.end;
    }

    throw new Error(`Invalid axis position ${axisPos}, axis position must be 0 or 2`);
  };

  // loop through cube
  // if passed function returns, loops are ended
  const loopThroughCube = (func) => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (func(x, y, z) != undefined) {
            return;
          }
        }
      }
    }
  };

  // is in target position
  const isInTargetPosition = (piece, targetPos) => {
    let returnVal = true;

    const targetPieceColors = Object.values(cube.cube[targetPos.x][targetPos.y][targetPos.z]);

    Object.values(piece).forEach((color) => {
      if (targetPieceColors.indexOf(color) === -1) {
        returnVal = false;
      }
    });

    return returnVal;
  };

  // top cross
  const solvePieceInTopCross = (pieceColor) => {
    loopThroughCube((x, y, z) => {
      const piece = cube.cube[x][y][z];
      const pieceColors = Object.values(piece);

      // target position for colors to match up
      const targetPiecePosForColors = {
        r: { x: 2, z: 1 },
        g: { x: 1, z: 0 },
        o: { x: 0, z: 1 },
        b: { x: 1, z: 2 },
      };

      if (pieceColors.length === 2 && pieceColors.indexOf('w') > -1 && pieceColors.indexOf(pieceColor) > -1) {
        // found target piece to be moved
        // first, move piece to where white part is on the yellow face
        const piecePos = { x, y, z };

        // white face and colored face where: first element --> axis; second element --> axis value
        let whiteFacePos;
        let coloredFacePos;

        Object.keys(piece).forEach((axis) => {
          const axisColor = piece[axis];
          if (axisColor === 'w') {
            whiteFacePos = [axis, piecePos[axis]];
          } else {
            coloredFacePos = [axis, piecePos[axis]];
          }
        });

        // colored part is on yellow face and
        // white part is on a face other than yellow
        if (y === 2 && whiteFacePos[0] !== 'y') {
          console.log('First Case');

          const faceToMove = toFaceFromAxis(whiteFacePos[0], whiteFacePos[1]);
          makeMoveWithNotation(toNotation(faceToMove));
          makeMoveWithNotation(toNotation(faceToMove));

          // continue solving (to second case)
          solvePieceInTopCross(pieceColor);
        } else if (y === 0 && whiteFacePos[0] !== 'y') {
          console.log('Second Case');

          // move yellow face so that piece is on adjacent face to its target face

          // arbitrary array indices to maintain position of each face
          const faceMovePosition = ['g', 'r', 'b', 'o'];

          const currentFace = toFaceFromAxis(whiteFacePos[0], whiteFacePos[1]);
          const adjacentFaceToTarget = faceMovePosition[(faceMovePosition.indexOf(pieceColor) - 1 + 4) % faceMovePosition.length];

          console.log('Current Face', currentFace);
          console.log('Adjacent to Target Face', adjacentFaceToTarget);

          let movesToAdjacentFaceToTarget = faceMovePosition.indexOf(adjacentFaceToTarget) - faceMovePosition.indexOf(currentFace);

          // convert negative (inverse) moves to positive (clockwise) moves
          if (movesToAdjacentFaceToTarget < 0) {
            movesToAdjacentFaceToTarget = 4 + movesToAdjacentFaceToTarget;
          }

          // move piece to adjacent face to target
          for (let i = 0; i < movesToAdjacentFaceToTarget; i++) {
            makeMoveWithNotation(toNotation('y'));
          }

          // move face to correct position
          makeMoveWithNotation(toNotation(adjacentFaceToTarget, false));
          makeMoveWithNotation(toNotation(pieceColor));
          makeMoveWithNotation(toNotation(adjacentFaceToTarget));
        } else if (y === 1) {
          console.log('Third Case');
          // move face either clockwise or counterclockwise until the piece is on the yellow face
          const faceToMove = toFaceFromAxis(coloredFacePos[0], coloredFacePos[1]);

          // inverse move of the main move of this case
          let inverseMove = toNotation(faceToMove, false);

          // try moving face clockwise
          makeMoveWithNotation(toNotation(faceToMove));

          // check if clockwise moved the piece to the yellow face; if not, move counterclockwise
          // make sure to update the inverse move if needed
          loopThroughCube((x, y, z) => {
            const piece = cube.cube[x][y][z];
            const pieceColors = Object.values(piece);

            if (pieceColors.length === 2 && pieceColors.indexOf('w') > -1 && pieceColors.indexOf(pieceColor) > -1) {
              // check if piece is indeed on the yellow face
              // if not, undo the previous move and move counterclockwise instead
              if (y !== 0) {
                makeMoveWithNotation(toNotation(faceToMove, false));
                makeMoveWithNotation(toNotation(faceToMove, false));

                inverseMove = toNotation(faceToMove);
                return true;
              }
            }
          });

          // finally, move yellow face so that piece is not touching face that was just moved
          makeMoveWithNotation(toNotation('y'));

          // then make inverse move of the previous (before the yellow face move) move
          makeMoveWithNotation(inverseMove);

          // continue solving (to fifth case)
          solvePieceInTopCross(pieceColor);
        } else if (y === 2 && whiteFacePos[0] === 'y') {
          console.log('Fourth Case');

          let targetPiecePos = targetPiecePosForColors[pieceColor];
          targetPiecePos.y = 2;

          // only move if not already solved
          if (!isInTargetPosition(piece, targetPiecePos)) {
            const faceToMove = toFaceFromAxis(coloredFacePos[0], coloredFacePos[1]);
            makeMoveWithNotation(toNotation(faceToMove));
            makeMoveWithNotation(toNotation(faceToMove));

            // continue solving (to fifth case)
            solvePieceInTopCross(pieceColor);
          }
        } else if (y === 0 && whiteFacePos[0] === 'y') {
          console.log('Fifth Case');

          // move yellow face until colors match up
          let targetPiecePos = targetPiecePosForColors[pieceColor];
          targetPiecePos.y = 0;

          while (!isInTargetPosition(piece, targetPiecePos)) {
            makeMoveWithNotation(toNotation('y'));
          }

          // move piece from yellow face to white face (to correct position)
          makeMoveWithNotation(toNotation(pieceColor));
          makeMoveWithNotation(toNotation(pieceColor));
        }

        return true;
      }
    });
  };

  console.log('Green:');
  solvePieceInTopCross('g');
  console.log('Red:');
  solvePieceInTopCross('r');
  console.log('Blue:');
  solvePieceInTopCross('b');
  console.log('Orange:');
  solvePieceInTopCross('o');
};
