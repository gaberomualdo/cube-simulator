const DraggableComponent = require('./draggableComponent');
const stopwatch = document.querySelector('.stopwatch');
const stopwatchHeader = document.querySelector('.stopwatch header');
const stopwatchIcon = document.querySelector('.stopwatch header i');

const start = document.querySelector('.stopwatch .start-stop');
const reset = document.querySelector('.stopwatch .reset');

let open = !stopwatch.classList.contains('closed');

let x = 32;
let y = window.innerHeight - 200;

let startTime = 0;
let interval;
let going = false;
let additionalDiff = 0;

const updatePos = () => {
  stopwatch.setAttribute('style', `--x: ${x}px; --y: ${y}px`);
};
const updateOpen = () => {
  if (open) {
    stopwatch.classList.remove('closed');
  } else {
    stopwatch.classList.add('closed');
  }
};

new DraggableComponent(stopwatch, stopwatchHeader, [x, y], ([newX, newY]) => {
  x = newX;
  y = newY;
  updatePos();
});

stopwatchHeader.addEventListener('click', () => {
  if (!open) {
    open = true;
    updateOpen();
    updatePos();
  }
});
stopwatchIcon.addEventListener('click', (evt) => {
  if (open) {
    open = false;
    updateOpen();
    updatePos();
    evt.stopPropagation();
  }
});

const updateStopStartBtn = () => {
  start.innerText = going ? 'Stop' : 'Start';
};

const updateTime = (mi, se, ms) => {
  document.querySelector('.stopwatch .min + .unit').style.display = 'inline-block';
  if (mi === 0) {
    mi = '';
    document.querySelector('.stopwatch .min + .unit').style.display = 'none';
  }
  ms = Math.floor(ms / 10).toString();
  document.querySelector('.stopwatch .min').innerText = mi;
  document.querySelector('.stopwatch .sec').innerText = se;
  document.querySelector('.stopwatch .ms').innerText = ms.length === 2 ? ms : `0${ms}`;
};

const intervalMS = 10;
const min = 1000 * 60;
const sec = 1000;

const startStopwatch = () => {
  startTime = new Date().getTime();
  interval = setInterval(() => {
    const cur = new Date().getTime();
    let diff = cur - startTime + additionalDiff;
    const mi = Math.floor(diff / min);
    diff %= min;
    const se = Math.floor(diff / sec);
    diff %= sec;
    updateTime(mi, se, diff);
  }, intervalMS);
};
const stopStopwatch = () => {
  const cur = new Date().getTime();
  additionalDiff += cur - startTime;
  clearInterval(interval);
};
const toggleStopwatch = () => {
  going = !going;
  if (going) {
    startStopwatch();
  } else {
    stopStopwatch();
  }
  updateStopStartBtn();
};

start.addEventListener('click', () => {
  start.blur();
  toggleStopwatch();
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    toggleStopwatch();
  }
});

reset.addEventListener('click', () => {
  reset.blur();

  going = false;
  additionalDiff = 0;
  clearInterval(interval);
  updateTime(0, 0, 0);
  updateStopStartBtn();
});

updateTime(0, 0, 0);
