const defaultPage = 'simulator';
const logPage = 'simulator';
const validPages = ['about', 'simulator', 'scrambler', 'solver', /* 'live', */ 'learn'];
const setPage = (p, updateURL = true) => {
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  if (p !== logPage && document.body.classList.contains('log-open')) {
    document.body.classList.remove('log-open');
    document.querySelector('.logo-buttons .toggle-log').classList.remove('log-open');
    document.querySelector('.log').classList.remove('open');
  }

  document.querySelectorAll('[data-page]').forEach((e) => {
    if (e.classList.contains('active')) {
      e.classList.remove('active');
    }
  });
  document.querySelectorAll(`[data-page='${p}']`).forEach((e) => {
    e.classList.add('active');
  });

  const url = new URL(window.location.href);
  if (p.length > 0) {
    url.searchParams.set('p', p);
    document.title = `${capitalize(p)} – ${SITE_TITLE}`;
  } else if (p.length === 0) {
    if (url.searchParams.has('p')) {
      url.searchParams.delete('p');
    }
    document.title = SITE_TITLE;
  }

  const newURL = url.toString();
  window.scrollTo(0, 0);
  if (window.location.href !== newURL) {
    history.pushState({}, 'Navigate to New Page', newURL);
  }
};
const getPage = () => {
  const url = new URL(window.location.href);
  if (url.searchParams.has('p')) {
    const p = url.searchParams.get('p');
    return validPages.indexOf(p) > -1 ? p : defaultPage;
  }
  return defaultPage;
};
setPage(getPage());

window.addEventListener('popstate', () => {
  setPage(getPage());
});

document.querySelectorAll('.page-link').forEach((link) => {
  link.setAttribute('href', '?p=' + (link.getAttribute('data-page') || defaultPage));
  link.addEventListener('click', (evt) => {
    evt.preventDefault();
    const p = link.getAttribute('data-page');
    if (p && validPages.indexOf(p) > -1) {
      setPage(p);
    }
  });
});

module.exports = { getPage, setPage };
