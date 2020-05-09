const Cube = require('./cube');

// Array contains function (returns true if item is in array; false if not)
Array.prototype.contains = function (item) {
  return this.indexOf(item) > -1;
};

// Array equals function (returns true if passed array is equal to the array)
Array.prototype.equals = function (array) {
  for (let i = 0; i < this.length; i++) {
    if (i >= array.length || array[i] !== this[i]) {
      return false;
    }
  }
  return true;
};

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
      if (!targetPieceColors.contains(color)) {
        returnVal = false;
      }
    });

    return returnVal;
  };

  // get inverse of a move
  const getInverseOfNotation = (notation) => {
    if (notation.length == 1) {
      return notation + "'";
    } else {
      return notation[0];
    }
  };

  // make four moves sequence ([up, right, down, left] or [up, left, down, right])
  const performSolveForPieceAlgorithm = (face, right = true) => {
    // first moves (faces) for movement for each face
    const rightFirstMoves = {
      g: 'o',
      o: 'b',
      b: 'r',
      r: 'g',
    };
    const leftFirstMoves = {
      g: 'r',
      r: 'b',
      b: 'o',
      o: 'g',
    };

    let firstMove;
    let secondMove;

    if (right) {
      firstMove = toNotation(rightFirstMoves[face]);

      // right second move is always clockwise on the yellow face
      secondMove = toNotation('y');
    } else {
      // left first move is always counter clockwise
      firstMove = toNotation(leftFirstMoves[face], false);

      // left second move is always counter clockwise on the yellow face
      secondMove = toNotation('y', false);
    }

    makeMoveWithNotation(firstMove);
    makeMoveWithNotation(secondMove);

    // make inverse of first and second move
    makeMoveWithNotation(getInverseOfNotation(firstMove));
    makeMoveWithNotation(getInverseOfNotation(secondMove));
  };

  // find face to move for piece algorithm with given piece position
  const findFaceForPieceAlgorithm = (piecePos, right = true) => {
    // only pay attention to (x, z) position (2D coordinates)
    const piece2DCoords = [piecePos.x, piecePos.z];

    // preset return values
    if (right) {
      if (piece2DCoords.equals([0, 0])) {
        return 'g';
      } else if (piece2DCoords.equals([2, 0])) {
        return 'r';
      } else if (piece2DCoords.equals([2, 2])) {
        return 'b';
      } else if (piece2DCoords.equals([0, 2])) {
        return 'o';
      }
    } else {
      if (piece2DCoords.equals([0, 0])) {
        return 'o';
      } else if (piece2DCoords.equals([0, 2])) {
        return 'b';
      } else if (piece2DCoords.equals([2, 2])) {
        return 'r';
      } else if (piece2DCoords.equals([2, 0])) {
        return 'g';
      }
    }

    throw new Error(`Given piece position (${piecePos.x}, ${piecePos.y}, ${piecePos.z}) is not a corner piece.`);
  };

  // solve top cross
  const solvePieceInTopCross = (pieceColor) => {
    loopThroughCube((x, y, z) => {
      const piece = cube.cube[x][y][z];
      const pieceColors = Object.values(piece);

      if (pieceColors.length === 2 && pieceColors.contains('w') && pieceColors.contains(pieceColor)) {
        // found piece to be moved

        // target position for colors to match up
        const targetPiecePosForColors = {
          r: { x: 2, z: 1 },
          g: { x: 1, z: 0 },
          o: { x: 0, z: 1 },
          b: { x: 1, z: 2 },
        };

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

        // cycle through 5 separate cases
        // TODO: add comments about what each of the cases are

        if (y === 2 && whiteFacePos[0] !== 'y') {
          // first case

          const faceToMove = toFaceFromAxis(whiteFacePos[0], whiteFacePos[1]);
          makeMoveWithNotation(toNotation(faceToMove));
          makeMoveWithNotation(toNotation(faceToMove));

          // continue solving (to second case)
          solvePieceInTopCross(pieceColor);
        } else if (y === 0 && whiteFacePos[0] !== 'y') {
          // second case

          // move yellow face so that piece is on adjacent face to its target face

          // arbitrary array indices to maintain position of each face
          const faceMovePosition = ['g', 'r', 'b', 'o'];

          const currentFace = toFaceFromAxis(whiteFacePos[0], whiteFacePos[1]);
          const adjacentFaceToTarget = faceMovePosition[(faceMovePosition.indexOf(pieceColor) - 1 + 4) % faceMovePosition.length];

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
          // third case

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

            if (pieceColors.length === 2 && pieceColors.contains('w') && pieceColors.contains(pieceColor)) {
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
          // fourth case

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
          // fifth case

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

  // solve top corners
  const solvePieceInTopCorners = (pieceFirstColor, pieceSecondColor) => {
    loopThroughCube((x, y, z) => {
      const piece = cube.cube[x][y][z];
      const pieceColors = Object.values(piece);

      // target position for colors to match up
      const getTargetPiecePosForColors = (firstColor, secondColor) => {
        const colors = [firstColor, secondColor];
        if (colors.contains('g') && colors.contains('o')) {
          return { x: 0, z: 0, y: 2 };
        } else if (colors.contains('o') && colors.contains('b')) {
          return { x: 0, z: 2, y: 2 };
        } else if (colors.contains('b') && colors.contains('r')) {
          return { x: 2, z: 2, y: 2 };
        } else if (colors.contains('r') && colors.contains('g')) {
          return { x: 2, z: 0, y: 2 };
        }

        throw new Error(`Corner with colors ${firstColor} and ${secondColor} is not valid.`);
      };

      // is in target position with correct white face
      const isInTargetPositionWithWhiteFace = (piece, targetPos) => {
        return isInTargetPosition(piece, targetPos) && cube.cube[targetPos.x][targetPos.y][targetPos.z].y === 'w';
      };

      if (pieceColors.length === 3 && pieceColors.contains('w') && pieceColors.contains(pieceFirstColor) && pieceColors.contains(pieceSecondColor)) {
        // found piece to move

        const piecePos = { x, y, z };

        const targetPos = getTargetPiecePosForColors(pieceFirstColor, pieceSecondColor);

        if (y === 2) {
          // first case
          if (!isInTargetPositionWithWhiteFace(piece, targetPos)) {
            performSolveForPieceAlgorithm(findFaceForPieceAlgorithm(piecePos));

            solvePieceInTopCorners(pieceFirstColor, pieceSecondColor);
          }
        } else if (y === 0) {
          // second case
          const targetPosOnYellowFace = { x: targetPos.x, z: targetPos.z, y: 0 };

          while (!isInTargetPosition(piece, targetPosOnYellowFace)) {
            makeMoveWithNotation(toNotation('y'));
          }

          while (!isInTargetPositionWithWhiteFace(piece, targetPos)) {
            performSolveForPieceAlgorithm(findFaceForPieceAlgorithm(targetPos));
          }
        }
        return true;
      }
    });
  };

  // solve top cross
  solvePieceInTopCross('g');
  solvePieceInTopCross('r');
  solvePieceInTopCross('b');
  solvePieceInTopCross('o');

  // solve top corners
  solvePieceInTopCorners('g', 'o');
  solvePieceInTopCorners('o', 'b');
  solvePieceInTopCorners('b', 'r');
  solvePieceInTopCorners('r', 'g');
};
