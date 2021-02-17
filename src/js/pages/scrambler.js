const Cube = require('../cube');
const VisualizedCube = require('../dom/visualizedCube');
const { getCubeTransitionTimeMS, convertFacesObj } = require('../util');

const transitionTimeMS = getCubeTransitionTimeMS();

const getInverse = (move) => {
  return move.length === 2 ? move[0] : `${move}'`;
};

const colors = {
  f: 'green',
  b: 'blue',
  l: 'orange',
  r: 'red',
  u: 'white',
  d: 'yellow',
};

const cubeElm = document.querySelector('.page.scrambler .center-cube');
const notationElm = document.querySelector('.page.scrambler .scramble-notation');
const scrambleSectionElm = document.querySelector('.page.scrambler .scramble-moves-section .moves');
const movesInputElm = document.querySelector('.page.scrambler input.scramble–moves');

let keydownFunction = () => {};

document.addEventListener('keydown', (e) => {
  keydownFunction(e);
});

const makeMove = (move, cubeView, cubeData) => {
  const moveDirection = move.length === 2 ? -1 : 1;
  const faces = {
    b: 'back',
    f: 'front',
    r: 'right',
    l: 'left',
    u: 'top',
    d: 'bottom',
  };
  const face = faces[move[0].toLowerCase()];

  cubeView.moveCubeFace(face, moveDirection, () => {
    cubeView.cubeData = cubeData;
  });
};
const setView = (cubeData, cubeView) => {
  cubeView.cubeData = cubeData;
  cubeView.resetCube(cubeView);
  cubeView.initializeCube();
};
const newScramble = () => {
  cubeElm.innerHTML = '';
  notationElm.innerHTML = '';
  scrambleSectionElm.innerHTML = '';
  document.querySelector('.page.scrambler .cube-area .active-move').innerHTML = `<button class="back">
        <i class="im im-angle-left"></i>
      </button>
      <div class="move-number"></div>
      <div class="move not-button"></div>
      <button class="forward">
        <i class="im im-angle-right"></i>
      </button>`;

  const cube = new Cube();
  const initialCubeData = convertFacesObj(cube.toFacesObj());
  const cubeView = new VisualizedCube((transitionTimeMS - 50) / 1000, cubeElm, initialCubeData.clone());

  let amountOfMoves = parseInt(movesInputElm.value);
  if (!(amountOfMoves > 0 && amountOfMoves < 1000)) {
    amountOfMoves = 20;
    movesInputElm.value = amountOfMoves;
  }

  const scrambleMoves = [];

  const goToMove = (i) => {
    const btn = document.querySelector('.page.scrambler .scramble-notation > button[data-idx="' + i + '"]');
    const activeBtn = document.querySelector('.page.scrambler .scramble-notation > button.active');
    let madeMove = false;

    let newCubeData = i < 0 ? initialCubeData : scrambleMoves[i].cubeData;

    if (activeBtn) {
      const activeBtnIdx = parseInt(activeBtn.getAttribute('data-idx'));
      if (activeBtnIdx + 1 === i) {
        makeMove(scrambleMoves[i].notation, cubeView, newCubeData);
        madeMove = true;
      } else if (activeBtnIdx - 1 === i) {
        makeMove(getInverse(scrambleMoves[activeBtnIdx].notation), cubeView, newCubeData);
        madeMove = true;
      }
      activeBtn.classList.remove('active');
    }
    if (!madeMove) {
      setView(newCubeData, cubeView);
    }
    btn.classList.add('active');
    document.querySelector('.page.scrambler .cube-area .active-move .move').innerHTML = btn.innerHTML;
    document.querySelector('.page.scrambler .cube-area .active-move .move-number').innerText = `${i + 1}.`;
    if (i + 1 === amountOfMoves) {
      document.querySelector('.page.scrambler .cube-area .active-move button.forward').classList.add('disabled');
    } else {
      document.querySelector('.page.scrambler .cube-area .active-move button.forward').classList.remove('disabled');
    }
    if (i + 1 === 0) {
      document.querySelector('.page.scrambler .cube-area .active-move button.back').classList.add('disabled');
    } else {
      document.querySelector('.page.scrambler .cube-area .active-move button.back').classList.remove('disabled');
    }
  };

  const goToAdjacentMove = (next = true) => {
    const activeBtn = document.querySelector('.page.scrambler .scramble-notation > button.active');
    const activeIdx = parseInt(activeBtn.getAttribute('data-idx'));
    const newMove = activeIdx + (next ? 1 : -1);
    if (!(newMove < -1 || newMove >= amountOfMoves)) {
      goToMove(newMove);
    }
  };
  (() => {
    const backBtn = document.querySelector('.page.scrambler .cube-area .active-move button.back');
    const forwardBtn = document.querySelector('.page.scrambler .cube-area .active-move button.forward');
    backBtn.addEventListener('click', () => {
      backBtn.blur();
      goToAdjacentMove(false);
    });
    forwardBtn.addEventListener('click', () => {
      forwardBtn.blur();
      goToAdjacentMove(true);
    });
    keydownFunction = (e) => {
      if (getPage() === 'scrambler') {
        if (e.key === 'ArrowLeft') {
          goToAdjacentMove(false);
        } else if (e.key === 'ArrowRight') {
          goToAdjacentMove(true);
        }
      }
    };
  })();

  cube.scramble(amountOfMoves, async (notation) => {
    const cubeData = convertFacesObj(cube.toFacesObj());
    scrambleMoves.push({
      notation,
      cubeData,
    });

    if (scrambleMoves.length === amountOfMoves) {
      notationElm.innerHTML += `
        <button data-idx="-1">Start</button>
        `;
      scrambleMoves.forEach((e, i) => {
        const color = colors[e.notation[0].toLowerCase()];
        const moveHTML = `<span class='number'>${i + 1}.</span>
          <span class='notation'>${e.notation}&nbsp;</span>
          <span class='face-view'>&bull; ${color} ${e.notation.length === 2 ? 'C' : ''}CW</span>
          <div class="move-badge ${color}"><img src="rotate_arrows/${e.notation.length === 2 ? 'counter' : ''}clockwise${
          color === 'white' || color === 'yellow' ? '_dark' : ''
        }.png"></div>`;
        notationElm.innerHTML += `
          <button data-idx="${i}">
          ${moveHTML}
          </button>
          `;
        scrambleSectionElm.innerHTML += `
          <div class="move-container" data-idx="${i}">
            <div class="move-cube"></div>
            <div class="info">${moveHTML}</div>
          </div>
          `;
      });

      // set up notation buttons on the left
      document.querySelectorAll('.page.scrambler .scramble-notation > button').forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btn.blur();
          goToMove(i - 1);
        });
      });

      // set up cubes on the right
      scrambleSectionElm.querySelectorAll('.move-container').forEach((e, i) => {
        const moveCubeElm = e.querySelector('.move-cube');
        const moveCube = new VisualizedCube((transitionTimeMS - 50) / 1000, moveCubeElm, scrambleMoves[i].cubeData);
      });

      // go to last move
      goToMove(amountOfMoves - 1);
    }
  });
};
const newScrambleBtn = document.querySelector('.page.scrambler .new-scramble');

// (() => {
//   const cube = new Cube();
//   const initialCubeData = convertFacesObj(cube.toFacesObj());
//   const cubeView = new VisualizedCube((transitionTimeMS - 50) / 1000, cubeElm, initialCubeData.clone());
//   cubeView.cubeData = initialCubeData;
// })();

newScramble();

newScrambleBtn.addEventListener('click', () => {
  newScramble();
});
