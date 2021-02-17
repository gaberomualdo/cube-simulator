const CubeJS = require('cubejs');
let cubeJSSolverInitialized = false;

const Cube = require('./cube');

// (async () => {
//   console.log('solving');
//   // Create a new solved cube instance
//   const testCube = new CubeJS();

//   // Apply an algorithm or randomize the cube state
//   testCube.move("U F R2 B' D2 L'");
//   console.log(testCube.solve());
// })();

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

// rotate matrix function
const rotateMatrix = (matrix) => {
  return matrix.map((row, i) => row.map((val, j) => matrix[matrix.length - 1 - j][i]));
};

// convert face to notation
const faceToNotation = (e) => {
  e = e.toLowerCase();
  if (e === 'g') return 'F';
  if (e === 'r') return 'R';
  if (e === 'w') return 'U';
  if (e === 'o') return 'L';
  if (e === 'b') return 'B';
  if (e === 'y') return 'D';
};

// solve function
module.exports = (cube, makeMoveWithNotation) => {
  if (!cubeJSSolverInitialized) {
    CubeJS.initSolver();
  }

  const faces = JSON.parse(JSON.stringify(cube.toFacesObj()));

  // orange and blue faces need to be rotated
  faces.o = rotateMatrix(rotateMatrix(faces.o));
  faces.b = rotateMatrix(rotateMatrix(faces.b));

  // yellow face needs to be rotated
  faces.y = rotateMatrix(faces.y);

  const cubeJSString = [faces.w, faces.r, faces.g, faces.y, faces.o, faces.b]
    .map((e) =>
      [].concat
        .apply([], e)
        .map((e) => faceToNotation(e))
        .join('')
    )
    .join('');

  const cubeJSCube = CubeJS.fromString(cubeJSString);
  const solvedMoves = cubeJSCube.solve().split(' ');

  solvedMoves.forEach((move) => {
    if (move.endsWith('2')) {
      const moveNotation = move.slice(0, move.length - 1);
      makeMoveWithNotation(moveNotation);
      makeMoveWithNotation(moveNotation);
    } else {
      makeMoveWithNotation(move);
    }
  });

  return;

  // below is my, less efficient, ~125-200 move solving algorithm. it is faster than the CubeJS solver.

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

    if (axisPos === 0) {
      return axisWithFaces.start;
    } else if (axisPos === 2) {
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
    if (notation.length === 1) {
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

  // solve second layer
  const solvePieceInSecondLayer = (pieceFirstColor, pieceSecondColor) => {
    loopThroughCube((x, y, z) => {
      const piece = cube.cube[x][y][z];
      const pieceColors = Object.values(piece);

      if (pieceColors.length === 2 && pieceColors.contains(pieceFirstColor) && pieceColors.contains(pieceSecondColor)) {
        // found piece to be moved

        const piecePos = { x, y, z };

        const getTargetPiecePosForColors = (firstColor, secondColor) => {
          const colors = [firstColor, secondColor];
          if (colors.contains('g') && colors.contains('o')) {
            return { x: 0, z: 0, y: 1 };
          } else if (colors.contains('o') && colors.contains('b')) {
            return { x: 0, z: 2, y: 1 };
          } else if (colors.contains('b') && colors.contains('r')) {
            return { x: 2, z: 2, y: 1 };
          } else if (colors.contains('r') && colors.contains('g')) {
            return { x: 2, z: 0, y: 1 };
          }

          throw new Error(`Side piece with colors ${firstColor} and ${secondColor} is not valid.`);
        };

        if (piecePos.y === 1) {
          // first case

          // check if already solved
          const colors = [pieceFirstColor, pieceSecondColor];

          let isInCorrectFinalPosition = false;

          if (colors.contains('g') && colors.contains('o') && piecePos.x === 0 && piecePos.z === 0) {
            isInCorrectFinalPosition = true;
          } else if (colors.contains('o') && colors.contains('b') && piecePos.x === 0 && piecePos.z === 2) {
            isInCorrectFinalPosition = true;
          } else if (colors.contains('b') && colors.contains('r') && piecePos.x === 2 && piecePos.z === 2) {
            isInCorrectFinalPosition = true;
          } else if (colors.contains('r') && colors.contains('g') && piecePos.x === 2 && piecePos.z === 0) {
            isInCorrectFinalPosition = true;
          }

          let isInCorrectOrientation = false;

          if (isInCorrectFinalPosition) {
            if (colors.contains('g') && piece.z === 'g') {
              isInCorrectOrientation = true;
            } else if (colors.contains('b') && piece.z === 'b') {
              isInCorrectOrientation = true;
            }
          }

          if (isInCorrectFinalPosition && isInCorrectOrientation) {
            return;
          }

          // not already solved, continue
          const faceToMoveRightMovement = findFaceForPieceAlgorithm(piecePos);
          const faceToMoveLeftMovement = findFaceForPieceAlgorithm(piecePos, false);

          performSolveForPieceAlgorithm(faceToMoveRightMovement);
          performSolveForPieceAlgorithm(faceToMoveLeftMovement, false);

          // continue solving
          solvePieceInSecondLayer(pieceFirstColor, pieceSecondColor);
        } else if (piecePos.y === 0) {
          // second case

          const targetTopFacePosForTopColor = {
            g: { x: 1, z: 2, y: 0 },
            r: { x: 0, z: 1, y: 0 },
            b: { x: 1, z: 0, y: 0 },
            o: { x: 2, z: 1, y: 0 },
          };

          const topColor = piece.y;

          const targetTopFacePos = targetTopFacePosForTopColor[topColor];
          while (!isInTargetPosition(piece, targetTopFacePos)) {
            makeMoveWithNotation(toNotation('y'));
          }

          const targetPosition = getTargetPiecePosForColors(pieceFirstColor, pieceSecondColor);

          const pieceMovementFaceRight = findFaceForPieceAlgorithm(targetPosition);
          const pieceMovementFaceLeft = findFaceForPieceAlgorithm(targetPosition, false);

          // decide which one to do first based on matching with original top color
          if (pieceMovementFaceRight !== topColor) {
            performSolveForPieceAlgorithm(pieceMovementFaceRight);
            performSolveForPieceAlgorithm(pieceMovementFaceLeft, false);
          } else if (pieceMovementFaceLeft !== topColor) {
            performSolveForPieceAlgorithm(pieceMovementFaceLeft, false);
            performSolveForPieceAlgorithm(pieceMovementFaceRight);
          }
        }

        return true;
      }
    });
  };

  const solveBottomCrossWithoutOrientation = () => {
    const hasYellowAsBottomColor = (piecePos) => {
      return cube.cube[piecePos.x][piecePos.y][piecePos.z].y === 'y';
    };

    // key --> written position of side piece on yellow face, oriented with green as front, yellow as top, and red as left
    // value --> full position as x, y, and z
    const piecePositions = {
      left: { x: 2, z: 1, y: 0 },
      bottom: { x: 1, z: 0, y: 0 },
      right: { x: 0, z: 1, y: 0 },
      top: { x: 1, z: 2, y: 0 },
    };

    let verticalPiecesWithYellowAsBottomColorCount = 0;
    let horizontalPiecesWithYellowAsBottomColorCount = 0;

    Object.keys(piecePositions).forEach((key) => {
      const curPiecePos = piecePositions[key];
      if (hasYellowAsBottomColor(curPiecePos)) {
        if (key === 'left' || key === 'right') {
          horizontalPiecesWithYellowAsBottomColorCount++;
        } else if (key === 'top' || key === 'bottom') {
          verticalPiecesWithYellowAsBottomColorCount++;
        }
      }
    });

    if (verticalPiecesWithYellowAsBottomColorCount === 2 && horizontalPiecesWithYellowAsBottomColorCount === 2) {
      // first case

      // already solved without orientation
      return;
    } else if (verticalPiecesWithYellowAsBottomColorCount === 0 && horizontalPiecesWithYellowAsBottomColorCount === 0) {
      // second case

      makeMoveWithNotation(toNotation('g'));
      performSolveForPieceAlgorithm('g');
      makeMoveWithNotation(toNotation('g', false));

      // continue solving
      solveBottomCrossWithoutOrientation();
    } else if (verticalPiecesWithYellowAsBottomColorCount === 1 && horizontalPiecesWithYellowAsBottomColorCount === 1) {
      // third case

      // turn until position looks like this (on yellow face):
      //  *
      // **-
      //  -
      // where * is yellow and - is other colors

      while (!(hasYellowAsBottomColor(piecePositions.left) && hasYellowAsBottomColor(piecePositions.top))) {
        makeMoveWithNotation(toNotation('y'));
      }

      makeMoveWithNotation(toNotation('g'));
      performSolveForPieceAlgorithm('g');
      makeMoveWithNotation(toNotation('g', false));

      // continue solving
      solveBottomCrossWithoutOrientation();
    } else if (verticalPiecesWithYellowAsBottomColorCount === 2) {
      // fourth case

      // current position looks like this (on yellow face):
      //  *
      // -*-
      //  *
      // where * is yellow and - is other colors

      // turn once to make position look like this instead:
      //  -
      // ***
      //  -

      makeMoveWithNotation(toNotation('y'));

      // continue solving
      solveBottomCrossWithoutOrientation();
    } else if (horizontalPiecesWithYellowAsBottomColorCount === 2) {
      // fifth case

      makeMoveWithNotation(toNotation('g'));
      performSolveForPieceAlgorithm('g');
      makeMoveWithNotation(toNotation('g', false));
    }
  };

  // solve orientation of bottom cross
  const solveBottomCrossOrientation = () => {
    // perform algorithm to fix orientation
    const performFixOrientationAlgorithm = (firstMoveFace) => {
      makeMoveWithNotation(toNotation(firstMoveFace));
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation(firstMoveFace, false));
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation(firstMoveFace));
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation(firstMoveFace, false));
      makeMoveWithNotation(toNotation('y'));
    };

    // key --> written position of side piece on yellow face, oriented with green as front, yellow as top, and red as left
    // value --> full position as x, y, and z
    const piecePositions = {
      left: { x: 2, z: 1, y: 0 },
      bottom: { x: 1, z: 0, y: 0 },
      right: { x: 0, z: 1, y: 0 },
      top: { x: 1, z: 2, y: 0 },
    };

    // face colors which each key in piecePositions corresponds to
    const pieceCorrectFaceColors = {
      left: 'r',
      bottom: 'g',
      right: 'o',
      top: 'b',
    };

    // get color on piece that is not yellow
    const getColorNotYellow = (piecePos) => {
      const piece = cube.cube[piecePos.x][piecePos.y][piecePos.z];
      if (piece.x) {
        return piece.x;
      }
      return piece.z;
    };

    // list of matching side pieces which are oriented correctly
    let matchingSidePieces = [];

    while (!(matchingSidePieces.length > 1)) {
      makeMoveWithNotation(toNotation('y'));

      matchingSidePieces = [];
      Object.keys(piecePositions).forEach((key) => {
        const curPiecePos = piecePositions[key];
        if (getColorNotYellow(curPiecePos) === pieceCorrectFaceColors[key]) {
          matchingSidePieces.push(key);
        }
      });
    }

    if (matchingSidePieces.length === 4) {
      // first case

      // all faces are matched!
      return;
    } else if (
      (matchingSidePieces.contains('left') && matchingSidePieces.contains('right')) ||
      (matchingSidePieces.contains('top') && matchingSidePieces.contains('bottom'))
    ) {
      // second case
      // pieces at the correct place are at opposite sides
      performFixOrientationAlgorithm('o');

      // continue solving
      solveBottomCrossOrientation();
    } else {
      // pieces at the correct place are at adjacent faces

      let firstFaceMoveOfAlgorithm = '';

      if (matchingSidePieces.contains('bottom') && matchingSidePieces.contains('left')) {
        firstFaceMoveOfAlgorithm = 'r';
      } else if (matchingSidePieces.contains('left') && matchingSidePieces.contains('top')) {
        firstFaceMoveOfAlgorithm = 'b';
      } else if (matchingSidePieces.contains('top') && matchingSidePieces.contains('right')) {
        firstFaceMoveOfAlgorithm = 'o';
      } else if (matchingSidePieces.contains('right') && matchingSidePieces.contains('bottom')) {
        firstFaceMoveOfAlgorithm = 'g';
      }

      performFixOrientationAlgorithm(firstFaceMoveOfAlgorithm);
    }
  };

  // solve position of bottom corners
  const solvePositionOfBottomCorners = () => {
    const getTargetPiecePosForColors = (firstColor, secondColor) => {
      const colors = [firstColor, secondColor];

      if (colors.contains('g') && colors.contains('o')) {
        return { x: 0, z: 0, y: 0 };
      } else if (colors.contains('o') && colors.contains('b')) {
        return { x: 0, z: 2, y: 0 };
      } else if (colors.contains('b') && colors.contains('r')) {
        return { x: 2, z: 2, y: 0 };
      } else if (colors.contains('r') && colors.contains('g')) {
        return { x: 2, z: 0, y: 0 };
      }
    };

    // perform corner swapping algorithm
    const performCornerSwappingAlgorithm = (firstMoveFace, secondMoveFace) => {
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation(firstMoveFace));
      makeMoveWithNotation(toNotation('y', false));
      makeMoveWithNotation(toNotation(secondMoveFace, false));
      makeMoveWithNotation(toNotation('y'));
      makeMoveWithNotation(toNotation(firstMoveFace, false));
      makeMoveWithNotation(toNotation('y', false));
      makeMoveWithNotation(toNotation(secondMoveFace));
    };

    const cornerColors = [
      ['g', 'o'],
      ['o', 'b'],
      ['b', 'r'],
      ['r', 'g'],
    ];

    let cornersInCorrectPlace = [];

    cornerColors.forEach((cornerColorPair) => {
      if (
        isInTargetPosition(
          { x: cornerColorPair[0], y: cornerColorPair[1], z: 'y' },
          getTargetPiecePosForColors(cornerColorPair[0], cornerColorPair[1])
        )
      ) {
        cornersInCorrectPlace.push(cornerColorPair);
      }
    });

    if (cornersInCorrectPlace.length === 4) {
      // first case

      // already solved
      return;
    } else if (cornersInCorrectPlace.length === 0) {
      // second case

      performCornerSwappingAlgorithm('o', 'r');

      // continue solving
      solvePositionOfBottomCorners();
    } else if (cornersInCorrectPlace.length >= 1) {
      // third case

      // perform swapping algorithm from first correct corner
      const correctCornerColors = cornersInCorrectPlace[0];

      let swappingAlgorithmFirstMoveFace;
      let swappingAlgorithmSecondMoveFace;

      if (correctCornerColors.contains('g') && correctCornerColors.contains('o')) {
        swappingAlgorithmFirstMoveFace = 'o';
        swappingAlgorithmSecondMoveFace = 'r';
      } else if (correctCornerColors.contains('o') && correctCornerColors.contains('b')) {
        swappingAlgorithmFirstMoveFace = 'b';
        swappingAlgorithmSecondMoveFace = 'g';
      } else if (correctCornerColors.contains('b') && correctCornerColors.contains('r')) {
        swappingAlgorithmFirstMoveFace = 'r';
        swappingAlgorithmSecondMoveFace = 'o';
      } else if (correctCornerColors.contains('r') && correctCornerColors.contains('g')) {
        swappingAlgorithmFirstMoveFace = 'g';
        swappingAlgorithmSecondMoveFace = 'b';
      }

      performCornerSwappingAlgorithm(swappingAlgorithmFirstMoveFace, swappingAlgorithmSecondMoveFace);

      // continue solving
      solvePositionOfBottomCorners();
    }
  };

  // solve orientation of bottom corners
  const solveOrientationOfBottomCorners = () => {
    // solve for piece at (0, 0, 0)
    const solveForOriginCornerPiece = () => {
      // continue solving until piece has yellow color at yellow face
      while (!(cube.cube[0][0][0].y === 'y')) {
        makeMoveWithNotation(toNotation('g'));
        makeMoveWithNotation(toNotation('w'));
        makeMoveWithNotation(toNotation('g', false));
        makeMoveWithNotation(toNotation('w', false));
      }
    };

    for (let i = 0; i < 4; i++) {
      solveForOriginCornerPiece();
      makeMoveWithNotation(toNotation('y', false));
    }
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

  // solve second layer
  solvePieceInSecondLayer('g', 'o');
  solvePieceInSecondLayer('o', 'b');
  solvePieceInSecondLayer('b', 'r');
  solvePieceInSecondLayer('r', 'g');

  // solve bottom cross
  solveBottomCrossWithoutOrientation();
  solveBottomCrossOrientation();

  // solve bottom corners
  solvePositionOfBottomCorners();
  solveOrientationOfBottomCorners();
};
