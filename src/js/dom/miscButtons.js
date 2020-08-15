const timeBetweenMovesMS = 25;

const isFocused = (element) => {
  return element === document.activeElement;
};

const timeSleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// returns a list of buttons and their onclick functions
module.exports = () => {
  let returnVal = {
    solve: async (Cube, cube, cubeImages, solveCube, compressMoves, history, callback) => {
      let movesToSolve = [];

      const cubeToSolve = new Cube(cube.cube);

      solveCube(cubeToSolve, (moveNotation) => {
        cubeToSolve.makeMove(moveNotation);
        movesToSolve.push(moveNotation);
      });

      // compress moves
      movesToSolve = compressMoves(movesToSolve);

      const makeMovesToSolve = async () => {
        const move = movesToSolve[movesMadeCount];
        cube.makeMove(move);
        history.add(move, true); // second arg --> isComputer

        movesMadeCount++;

        await timeSleep(3000 / movesToSolve.length);
        cubeImages.refreshCube(cube);

        if (movesMadeCount < movesToSolve.length) {
          makeMovesToSolve();
        } else {
          callback(movesToSolve.length);
        }
      };

      let movesMadeCount = 0;

      if (movesToSolve.length > 0) {
        makeMovesToSolve();
        cubeImages.refreshCube(cube);
      }
    },
    scramble: async (cube, cubeImages, history) => {
      const amountOfMoves = 50;
      await cube.scramble(amountOfMoves, async (notation) => {
        history.add(notation, true); // second arg --> isComputer
        await timeSleep(1000 / amountOfMoves);
        cubeImages.refreshCube(cube);
      });
    },
    undo: async (cube, cubeImages, history) => {
      const getInverse = (notation) => {
        if (notation.length === 1) {
          return notation + "'";
        } else {
          return notation[0];
        }
      };

      if (history.length() > 0) {
        const previousMove = history.pop();
        const inverseOfPreviousMove = getInverse(previousMove);

        cube.makeMove(inverseOfPreviousMove);

        await cubeImages.refreshCube(cube);
      }
    },
  };

  document.querySelectorAll('.col:first-child .moves .content .misc-buttons li button').forEach((button) => {
    // if focused, blur after a certain amount of time
    button.addEventListener('focus', function () {
      setTimeout(() => {
        if (isFocused(this)) {
          this.blur();
        }
      }, 150);
    });

    // individual button events
    if (button.classList.contains('solve')) {
      returnVal.solveButton = button;
    } else if (button.classList.contains('scramble')) {
      returnVal.scrambleButton = button;
    } else if (button.classList.contains('undo')) {
      returnVal.undoButton = button;
    }
  });

  return returnVal;
};
