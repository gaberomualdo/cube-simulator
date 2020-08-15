const toggleLogBtn = document.querySelector('.logo-buttons .toggle-log');
const closeLogBtn = document.querySelector('.log .close-log');

const toggleLogOpen = (e) => {
  document.querySelector('.log').classList.toggle('open');
  toggleLogBtn.classList.toggle('log-open');
  document.body.classList.toggle('log-open');
};
toggleLogBtn.addEventListener('focus', (e) => e.target.blur());
toggleLogBtn.addEventListener('click', toggleLogOpen);
closeLogBtn.addEventListener('click', toggleLogOpen);
