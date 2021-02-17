document.querySelectorAll('.openable-section .label').forEach((sectionLabel) => {
  const click = (secLabel) => {
    const section = secLabel.parentElement;
    const sectionContents = section.querySelector('.content');
    section.classList.toggle('closed');
    sectionContents.setAttribute('style', '--current-height: ' + sectionContents.scrollHeight + 'px');
    setTimeout(() => {
      if (secLabel === document.activeElement) {
        secLabel.blur();
      }
    }, 250);
  };
  if (sectionLabel.getAttribute('data-open')) {
    click(sectionLabel);
  }
  sectionLabel.addEventListener('click', () => {
    click(sectionLabel);
  });
});
