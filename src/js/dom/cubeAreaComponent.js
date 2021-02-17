const VisualizedCube = require('../dom/visualizedCube');
const { getCubeTransitionTimeMS } = require('../util');

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

class CubeAreaComponent {
  constructor(containerElm) {
    this.container = containerElm;
    this.container.innerHTML = `<div class="center-cube"></div>
    <div class="active-move">
      <button class="back">
        <i class="im im-angle-left"></i>
      </button>
      <div class="move-number"></div>
      <div class="move not-button"></div>
      <button class="forward">
        <i class="im im-angle-right"></i>
      </button>
    </div>
    <div class="scramble-notation"></div>`;

    this.keydownFunction = () => {};

    document.addEventListener('keydown', (e) => {
      this.keydownFunction(e);
    });
  }
  initialize(movesToMake, initialCubeData) {
    const cubeElm = this.container.querySelector('.center-cube');
    const notationElm = this.container.querySelector('.scramble-notation');

    cubeElm.innerHTML = '';
    notationElm.innerHTML = '';

    this.container.querySelector('.active-move').innerHTML = `<button class="back">
    <i class="im im-angle-left"></i>
    </button>
    <div class="move-number"></div>
    <div class="move not-button"></div>
    <button class="forward">
      <i class="im im-angle-right"></i>
    </button>`;

    const cubeView = new VisualizedCube((transitionTimeMS - 50) / 1000, cubeElm, initialCubeData.clone());

    const scrambleMoves = [];

    const goToMove = (i) => {
      const btn = this.container.querySelector('.scramble-notation > button[data-idx="' + i + '"]');
      const activeBtn = this.container.querySelector('.scramble-notation > button.active');
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
      this.container.querySelector('.active-move .move').innerHTML = btn.innerHTML;
      this.container.querySelector('.active-move .move-number').innerText = `${i + 1}.`;
      if (i + 1 === amountOfMoves) {
        this.container.querySelector('.active-move button.forward').classList.add('disabled');
      } else {
        this.container.querySelector('.active-move button.forward').classList.remove('disabled');
      }
      if (i + 1 === 0) {
        this.container.querySelector('.active-move button.back').classList.add('disabled');
      } else {
        this.container.querySelector('.active-move button.back').classList.remove('disabled');
      }
    };

    const goToAdjacentMove = (next = true) => {
      const activeBtn = this.container.querySelector('.scramble-notation > button.active');
      const activeIdx = parseInt(activeBtn.getAttribute('data-idx'));
      const newMove = activeIdx + (next ? 1 : -1);
      if (!(newMove < -1 || newMove >= amountOfMoves)) {
        goToMove(newMove);
      }
    };
    (() => {
      const backBtn = this.container.querySelector('.active-move button.back');
      const forwardBtn = this.container.querySelector('.active-move button.forward');
      backBtn.addEventListener('click', () => {
        backBtn.blur();
        goToAdjacentMove(false);
      });
      forwardBtn.addEventListener('click', () => {
        forwardBtn.blur();
        goToAdjacentMove(true);
      });
      this.keydownFunction = (e) => {
        if (getPage() === page) {
          if (e.key === 'ArrowLeft') {
            goToAdjacentMove(false);
          } else if (e.key === 'ArrowRight') {
            goToAdjacentMove(true);
          }
        }
      };
    })();

    const amountOfMoves = movesToMake.length;

    movesToMake.forEach(async ({ notation, cubeData }) => {
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
        });

        // set up notation buttons on the left
        this.container.querySelectorAll('.scramble-notation > button').forEach((btn, i) => {
          btn.addEventListener('click', () => {
            btn.blur();
            goToMove(i - 1);
          });
        });

        // go to last move
        goToMove(amountOfMoves - 1);
      }
    });
  }
}

module.exports = CubeAreaComponent;
