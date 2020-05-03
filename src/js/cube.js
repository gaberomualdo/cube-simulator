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

  constructor(passedCube) {
    // cube represented on a graph, with (0,0,0)/[0][0][0] being the yellow-orange-green corner

    // colors are shorthands which can be derived from the colors object

    // each color is that which can be found on the end of the specified axis (x, y, or z)

    if (passedCube) {
      return (this.cube = passedCube);
    }

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

  moveFace(color) {}

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
