const { getCubeTransitionTimeMS } = require('../util');
const cubeTransitionTime = getCubeTransitionTimeMS();

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
        await timeSleep(cubeTransitionTime);
        const move = movesToSolve[movesMadeCount];
        cube.makeMove(move);
        history.add(move, true); // second arg --> isComputer

        movesMadeCount++;

        cubeImages.refreshCube(cube, move);

        if (movesMadeCount < movesToSolve.length) {
          makeMovesToSolve();
        } else {
          // calculate how many moves to solve, ignoring repeated moves
          let movesToSolveCount = 0;
          movesToSolve.forEach((e, i) => {
            if (i > 0 && movesToSolve[i - 1] !== e) {
              movesToSolveCount++;
            }
          });
          callback(movesToSolveCount);
        }
      };

      let movesMadeCount = 0;

      if (movesToSolve.length > 0) {
        makeMovesToSolve();
      }
    },
    scramble: async (cube, cubeImages, history) => {
      const amountOfMoves = 20;
      await cube.scramble(amountOfMoves, async (notation) => {
        await timeSleep(cubeTransitionTime);
        history.add(notation, true); // second arg --> isComputer
        cubeImages.refreshCube(cube, notation);
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

        await cubeImages.refreshCube(cube, inverseOfPreviousMove);
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
