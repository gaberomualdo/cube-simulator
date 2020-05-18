document.querySelectorAll('.openable-section .label').forEach((sectionLabel) => {
  sectionLabel.addEventListener('click', () => {
    sectionLabel.parentElement.classList.toggle('closed');
    setTimeout(() => {
      if (sectionLabel === document.activeElement) {
        sectionLabel.blur();
      }
    }, 250);
  });
});
