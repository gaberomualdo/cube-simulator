const Cube = require('../cube');
const VisualizedCube = require('../dom/visualizedCube');
const CubeAreaComponent = require('../dom/cubeAreaComponent');
const { convertFacesObj, getCubeTransitionTimeMS } = require('../util');

const transitionTimeMS = getCubeTransitionTimeMS();

const colors = {
  f: 'green',
  b: 'blue',
  l: 'orange',
  r: 'red',
  u: 'white',
  d: 'yellow',
};

const scrambleSectionElm = document.querySelector('.page.scrambler .scramble-moves-section .moves');
const movesInputElm = document.querySelector('.page.scrambler input.scramble–moves');

let scrambleCubeArea;

const newScramble = () => {
  scrambleSectionElm.innerHTML = '';

  const cube = new Cube();
  const initialCubeData = convertFacesObj(cube.toFacesObj());

  let amountOfMoves = parseInt(movesInputElm.value);
  if (!(amountOfMoves > 0 && amountOfMoves < 1000)) {
    amountOfMoves = 20;
    movesInputElm.value = amountOfMoves;
  }

  const scrambleMoves = [];

  cube.scramble(amountOfMoves, async (notation) => {
    const cubeData = convertFacesObj(cube.toFacesObj());
    scrambleMoves.push({
      notation,
      cubeData,
    });

    if (scrambleMoves.length === amountOfMoves) {
      scrambleMoves.forEach((e, i) => {
        const color = colors[e.notation[0].toLowerCase()];
        const moveHTML = `<span class='number'>${i + 1}.</span>
          <span class='notation'>${e.notation}&nbsp;</span>
          <span class='face-view'>&bull; ${color} ${e.notation.length === 2 ? 'C' : ''}CW</span>
          <div class="move-badge ${color}"><img src="rotate_arrows/${e.notation.length === 2 ? 'counter' : ''}clockwise${
          color === 'white' || color === 'yellow' ? '_dark' : ''
        }.png"></div>`;
        scrambleSectionElm.innerHTML += `
          <div class="move-container" data-idx="${i}">
            <div class="move-cube"></div>
            <div class="info">${moveHTML}</div>
          </div>
          `;
      });
      // set up cubes on the right
      scrambleSectionElm.querySelectorAll('.move-container').forEach((e, i) => {
        const moveCubeElm = e.querySelector('.move-cube');
        new VisualizedCube((transitionTimeMS - 50) / 1000, moveCubeElm, scrambleMoves[i].cubeData);
      });

      if (scrambleCubeArea && !scrambleCubeArea.isRemoved()) {
        scrambleCubeArea.remove();
      }
      scrambleCubeArea = new CubeAreaComponent(document.querySelector('.page.scrambler .cube-area-component'));
      scrambleCubeArea.initialize(scrambleMoves, initialCubeData, 'scrambler');
      newScrambleBtn.classList.remove('loading');
    }
  });
};
const newScrambleBtn = document.querySelector('.page.scrambler .new-scramble');

newScramble();

newScrambleBtn.addEventListener('click', () => {
  newScrambleBtn.classList.add('loading');
  newScrambleBtn.blur();
  newScramble();
});
