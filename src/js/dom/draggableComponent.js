class DraggableComponent {
  constructor(containerElm, dragElm, pos, setPos) {
    let dragStart = [0, 0];
    let dragging = false;
    let newPos = pos;

    const start = (e) => {
      dragStart = [e.clientX, e.clientY];
      dragging = true;
      containerElm.classList.add('dragging');
    };
    const drag = (e) => {
      if (dragging) {
        const cur = [e.clientX, e.clientY];
        const diff = [cur[0] - dragStart[0], cur[1] - dragStart[1]];
        newPos = [pos[0] + diff[0], pos[1] + diff[1]];

        newPos[0] = Math.max(0, newPos[0]);
        newPos[0] = Math.min(window.innerWidth - containerElm.offsetWidth, newPos[0]);

        newPos[1] = Math.max(0, newPos[1]);
        newPos[1] = Math.min(window.innerHeight - containerElm.offsetHeight, newPos[1]);

        setPos(newPos);
      }
    };
    const stop = (e) => {
      dragging = false;
      containerElm.classList.remove('dragging');
      pos = newPos;
    };

    document.addEventListener('mouseup', (e) => {
      stop(e);
    });
    document.addEventListener('mousemove', (e) => {
      e.preventDefault();
      drag(e);
    });
    dragElm.addEventListener('mousedown', (e) => {
      start(e);
    });

    document.addEventListener('touchend', (e) => {
      stop(e.changedTouches[0]);
    });
    document.addEventListener(
      'touchmove',
      (e) => {
        if (dragging) {
          e.preventDefault();
        }
        drag(e.changedTouches[0]);
      },
      { passive: false }
    );
    dragElm.addEventListener('touchstart', (e) => {
      start(e.changedTouches[0]);
    });
  }
}

module.exports = DraggableComponent;
