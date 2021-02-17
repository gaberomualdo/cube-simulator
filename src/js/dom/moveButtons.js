module.exports = (makeMove) => {
  document.querySelectorAll('.col:first-child .moves .content .move-buttons .row .move').forEach((move) => {
    const isFocused = (element) => {
      return element === document.activeElement;
    };

    const moveButton = move.querySelector('button');

    const moveNotation = moveButton.querySelector('span.notation').innerText;

    let moveKeyNotationView = moveNotation[0].toLowerCase();
    let moveKeyFaceView = move.getAttribute('data-color')[0].toLowerCase();

    const isShiftCombo = move.getAttribute('data-direction') === 'counterclockwise'; // if key includes shift

    // initialize label with move key, and if applicable, "+ shift"
    move.querySelector('p.key').innerHTML = `
      ${isShiftCombo ? '<span class="shift">shift + </span>' : ''}
      <span class="face-view">${moveKeyFaceView}</span>
      <span class="notation-view">${moveKeyNotationView}</span>
    `;

    // if focused, blur after a certain amount of time
    moveButton.addEventListener('focus', function () {
      setTimeout(() => {
        if (isFocused(this)) {
          this.blur();
        }
      }, 150);
    });

    // move on click and when key shorthand is pressed

    moveButton.addEventListener('click', () => {
      if (getPage() === 'simulator') {
        makeMove(moveNotation);
      }
    });

    document.addEventListener('keydown', (e) => {
      const useFaceView = document.body.classList.contains('use-face-view');

      // remove combos with ctrl, cmd
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      // make sure shift is pressed when applicable and not pressed when applicable
      if (isShiftCombo && !e.shiftKey) {
        return;
      }
      if (!isShiftCombo && e.shiftKey) {
        return;
      }

      if (e.key.toLowerCase() !== (useFaceView ? moveKeyFaceView : moveKeyNotationView)) {
        // not correct key
        return;
      }

      // passed checks so make move
      makeMove(moveNotation);
    });
  });
};
