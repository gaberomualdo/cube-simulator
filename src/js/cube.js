class Cube {
  // keys are used as shorthands for the values
  static colors = {
    w: 'white',
    g: 'green',
    r: 'red',
    b: 'blue',
    y: 'yellow',
    o: 'orange',
  };

  // faces on the ends of each axis
  static faces = {
    x: {
      start: 'o',
      end: 'r',
    },
    y: {
      start: 'y',
      end: 'w',
    },
    z: {
      start: 'g',
      end: 'b',
    },
  };

  constructor() {
    // cube represented on a graph, with (0,0,0)/[0][0][0] being the yellow-orange-green corner

    // colors are shorthands which can be derived from the colors object

    // each color is that which can be found on the end of the specified axis (x, y, or z)

    const cube = [
      [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
    ];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          let piece = {};
          const piecePos = { x, y, z };

          Object.keys(piecePos).forEach((axis) => {
            const posOnAxis = piecePos[axis];

            if (posOnAxis === 0) {
              // start of an axis
              piece[axis] = Cube.faces[axis].start;
            } else if (posOnAxis === 2) {
              // end of an axis
              piece[axis] = Cube.faces[axis].end;
            }
          });

          cube[x][y][z] = piece;
        }
      }
    }

    this.cube = cube;
  }

  // scramble (make random moves)
  scramble(amountOfMoves = 30, afterEveryMove = () => {}) {
    const possibleNormalMoves = ['U', 'D', 'R', 'L', 'F', 'B'];

    for (let i = 0; i < amountOfMoves; i++) {
      const chosenMove = possibleNormalMoves[Math.floor(Math.random() * possibleNormalMoves.length)];
      const clockwise = [true, false][Math.floor(Math.random() * 2)];

      const notation = `${chosenMove}${clockwise ? "'" : ''}`;
      this.makeMove(notation);

      afterEveryMove(notation);
    }
  }

  // make move with Rubik's cube notation; not case-sensitive
  makeMove(notation) {
    notation = notation.toLowerCase().trim();
    let clockwise = true;

    let faceColor = '';

    switch (notation[0]) {
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
        break;
      default:
        throw new Error(`Invalid Rubik's cube notation with letter ${notation[0]}`);
    }

    // a "'" at the end of notation indicates counterclockwise rotation
    if (notation.length == 2 && notation[1] == "'") {
      clockwise = false;
    }

    // make move
    this.moveFace(faceColor, clockwise);
  }

  // move face (of color) either clockwise or counterclockwise (default is clockwise)
  moveFace(color, clockwise = true) {
    // copy of current cube for editing and replacement
    const newCube = JSON.parse(JSON.stringify(this.cube));

    // index in shifting pattern
    const indexInShiftingPattern = (coords, shiftingPattern) => {
      let foundIndex = -1;
      shiftingPattern.forEach((curCoords, ind) => {
        if (curCoords[0] === coords[0] && curCoords[1] === coords[1]) {
          foundIndex = ind;
        }
      });

      return foundIndex;
    };

    // next and previous indices
    const nextIndexInShiftingPattern = (currentIndex, shiftingPattern) => {
      return (currentIndex + 1) % shiftingPattern.length;
    };
    const prevIndexInShiftingPattern = (currentIndex, shiftingPattern) => {
      return (currentIndex - 1 + 4) % shiftingPattern.length;
    };

    // what axis the color is on and where
    let axis = '';
    let axisValue = -1;

    Object.keys(Cube.faces).forEach((curAxis) => {
      const axisColors = Cube.faces[curAxis];
      if (axisColors.start === color) {
        axisValue = 0;
      } else if (axisColors.end === color) {
        axisValue = 2;
      } else {
        return;
      }
      axis = curAxis;
    });

    // compensate for clockwise movement for each value
    let forwardMovement = clockwise;

    if (axis === 'y') {
      if (axisValue === 0) {
        forwardMovement = !forwardMovement;
      }
    } else if (axis === 'z') {
      if (axisValue === 2) {
        forwardMovement = !forwardMovement;
      }
    } else if (axis === 'x') {
      if (axisValue === 0) {
        forwardMovement = !forwardMovement;
      }
    }

    // shifting pattern (where each element => [row, col])
    const cornerShiftingPattern = [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ];
    const sideShiftingPattern = [
      [1, 0],
      [2, 1],
      [1, 2],
      [0, 1],
    ];

    // forward movement true implies a shift 1 forward, false implies shift 1 backward
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const piecePos = { x, y, z };
          const piece = this.cube[x][y][z];
          if (piecePos[axis] === axisValue) {
            // current piece should be moved

            // coords => [row, col]
            let coords = [-1, -1];

            if (axis === 'y') {
              coords = [piecePos.z, piecePos.x];
            } else if (axis === 'z') {
              coords = [piecePos.y, piecePos.x];
            } else if (axis === 'x') {
              coords = [piecePos.y, piecePos.z];
            }

            // check if a corner or side piece and evaluate new coords
            const indexAsCorner = indexInShiftingPattern(coords, cornerShiftingPattern);
            const indexAsSide = indexInShiftingPattern(coords, sideShiftingPattern);

            if (indexAsCorner > -1) {
              let newIndex;
              if (forwardMovement) {
                newIndex = nextIndexInShiftingPattern(indexAsCorner, cornerShiftingPattern);
              } else {
                newIndex = prevIndexInShiftingPattern(indexAsCorner, cornerShiftingPattern);
              }
              const newCoords = cornerShiftingPattern[newIndex];

              if (axis === 'y') {
                const newZ = newCoords[0];
                const newX = newCoords[1];

                newCube[newX][axisValue][newZ] = {
                  x: piece.z,
                  y: piece.y,
                  z: piece.x,
                };
              } else if (axis === 'z') {
                const newY = newCoords[0];
                const newX = newCoords[1];

                newCube[newX][newY][axisValue] = {
                  x: piece.y,
                  y: piece.x,
                  z: piece.z,
                };
              } else if (axis === 'x') {
                const newY = newCoords[0];
                const newZ = newCoords[1];

                newCube[axisValue][newY][newZ] = {
                  x: piece.x,
                  y: piece.z,
                  z: piece.y,
                };
              }
            } else if (indexAsSide > -1) {
              let newIndex;
              if (forwardMovement) {
                newIndex = nextIndexInShiftingPattern(indexAsSide, sideShiftingPattern);
              } else {
                newIndex = prevIndexInShiftingPattern(indexAsSide, sideShiftingPattern);
              }
              const newCoords = sideShiftingPattern[newIndex];

              if (axis === 'y') {
                const newZ = newCoords[0];
                const newX = newCoords[1];

                newCube[newX][axisValue][newZ] = {
                  y: piece.y,
                };

                if (piece.x) {
                  newCube[newX][axisValue][newZ].z = piece.x;
                } else if (piece.z) {
                  newCube[newX][axisValue][newZ].x = piece.z;
                }
              } else if (axis === 'z') {
                const newY = newCoords[0];
                const newX = newCoords[1];

                newCube[newX][newY][axisValue] = {
                  z: piece.z,
                };

                if (piece.x) {
                  newCube[newX][newY][axisValue].y = piece.x;
                } else if (piece.y) {
                  newCube[newX][newY][axisValue].x = piece.y;
                }
              } else if (axis === 'x') {
                const newY = newCoords[0];
                const newZ = newCoords[1];

                newCube[axisValue][newY][newZ] = {
                  x: piece.x,
                };

                if (piece.z) {
                  newCube[axisValue][newY][newZ].y = piece.z;
                } else if (piece.y) {
                  newCube[axisValue][newY][newZ].z = piece.y;
                }
              }
            }
          }
        }
      }
    }

    this.cube = newCube;
  }

  toFacesObj() {
    let faces = {};
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const piecePos = { x, y, z };
          const piece = this.cube[x][y][z];

          Object.keys(piecePos).forEach((axis) => {
            const posOnAxis = piecePos[axis];

            // if position on axis is one of the ends, get current face on axis and continue
            let curFace = '';

            if (posOnAxis === 0) {
              // start of an axis; set current face
              curFace = Cube.faces[axis].start;
            } else if (posOnAxis === 2) {
              // end of an axis; set current face
              curFace = Cube.faces[axis].end;
            } else {
              return;
            }

            if (!faces[curFace]) {
              faces[curFace] = [[], [], []];
            }

            // get position on face
            let row = -1;
            let col = -1;

            // these are presets to fix axis representation issues where it would
            // have row = 2 instead of row 0 for a specific axis for example
            if (axis === 'z') {
              row = 2 - y;
              col = x;
            } else if (axis === 'y') {
              row = 2 - z;
              col = x;
            } else if (axis === 'x') {
              row = 2 - y;
              col = z;
            }

            // more presets for back view faces orientation problems
            if (curFace === 'o' || curFace === 'b') {
              row = 2 - row;
            } else if (curFace === 'y') {
              [row, col] = [col, row];
              row = 2 - row;
              col = 2 - col;
            }

            faces[curFace][row][col] = piece[axis];
          });
        }
      }
    }

    return faces;
  }
}

module.exports = Cube;
