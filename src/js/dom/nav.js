window.addEventListener('load', () => {
  // initialize nav
  const nav = document.querySelector('nav.nav');
  const menuBtn = document.querySelector('nav.nav .menu-btn');
  const links = document.querySelector('nav.nav > .links');
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
    links.setAttribute('style', `--current-height: ${links.scrollHeight}px`);
  });
  global.closeNavigationMenu = () => {
    nav.classList.remove('menu-open');
  };
});
