document.querySelector('.col:first-child .logo .logo-buttons .toggle-notation').addEventListener('click', (e) => {
  document.body.classList.toggle('use-face-view');
  document.querySelector('.col:first-child .logo .logo-buttons .toggle-notation').blur();
});
