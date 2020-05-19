const isFocused = (element) => {
  return element === document.activeElement;
};

const getInverse = (notation) => {
  if (notation.length === 1) {
    return notation + "'";
  } else {
    return notation[0];
  }
};

module.exports = (Cube, cube, refreshCubeImages, solveCube, compressMoves, history) => {
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
      button.addEventListener('click', async () => {
        let movesToSolve = [];

        const cubeToSolve = new Cube(cube.cube);

        solveCube(cubeToSolve, (moveNotation) => {
          cubeToSolve.makeMove(moveNotation);
          movesToSolve.push(moveNotation);
        });

        // compress moves
        movesToSolve = compressMoves(movesToSolve);

        const makeMovesToSolve = async () => {
          movesMadeCount++;

          const move = movesToSolve[movesMadeCount];
          cube.makeMove(move);
          history.push(move);

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
      });
    } else if (button.classList.contains('scramble')) {
      button.addEventListener('click', async () => {
        await cube.scramble(25, async (notation) => {
          history.push(notation);
          await refreshCubeImages.refreshCube(cube);
        });
      });
    } else if (button.classList.contains('undo')) {
      button.addEventListener('click', async () => {
        if (history.length > 0) {
          let previousMove = history.pop();
          cube.makeMove(getInverse(previousMove));
          await refreshCubeImages.refreshCube(cube);
        }
      });
    }
  });
};
