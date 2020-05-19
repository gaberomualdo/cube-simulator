module.exports = (makeMove) => {
  document.querySelectorAll('.col:first-child .moves .content .move-buttons .row .move').forEach((move) => {
    const isFocused = (element) => {
      return element === document.activeElement;
    };

    const moveButton = move.querySelector('button');
    let moveKey = move.querySelector('p strong').innerText.split(' ').join('');

    const isShiftCombo = moveKey.includes('shift');

    if (isShiftCombo) {
      moveKey = moveKey.split('shift+').join('');
    }

    const moveKeyKeyCode = moveKey.toUpperCase().charCodeAt(0);

    const moveNotation = moveButton.innerText;

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
      makeMove(moveNotation);
    });

    document.addEventListener('keydown', (e) => {
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

      if (e.key !== undefined) {
        if (e.key.toLowerCase() !== moveKey.toLowerCase()) {
          // not correct key
          return;
        }
      } else if (e.keyCode !== undefined) {
        if (e.keyCode !== moveKeyKeyCode) {
          // not correct key
          return;
        }
      } else {
        // browser supports neither key or keycode
        return;
      }

      // passed checks so make move
      makeMove(moveNotation);
    });
  });
};
