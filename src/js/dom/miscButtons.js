const isFocused = (element) => {
  return element === document.activeElement;
};

// returns a list of buttons and their onclick functions
module.exports = () => {
  let returnVal = {
    solve: async (Cube, cube, refreshCubeImages, solveCube, compressMoves, history) => {
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
        history.push(move);

        movesMadeCount++;

        await refreshCubeImages.refreshCube(cube);

        if (movesMadeCount < movesToSolve.length) {
          makeMovesToSolve();
        }
      };

      let movesMadeCount = 0;

      if (movesToSolve.length > 0) {
        makeMovesToSolve();
        await refreshCubeImages.refreshCube(cube);
      }
    },
    scramble: async (cube, refreshCubeImages, history) => {
      await cube.scramble(25, async (notation) => {
        history.push(notation);
        await refreshCubeImages.refreshCube(cube);
      });
    },
    undo: async (cube, refreshCubeImages, history) => {
      const getInverse = (notation) => {
        if (notation.length === 1) {
          return notation + "'";
        } else {
          return notation[0];
        }
      };

      if (history.length > 0) {
        const previousMove = history.pop();
        const inverseOfPreviousMove = getInverse(previousMove);

        cube.makeMove(inverseOfPreviousMove);

        await refreshCubeImages.refreshCube(cube);
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
