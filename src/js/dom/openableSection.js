document.querySelectorAll('.openable-section .label').forEach((sectionLabel) => {
  sectionLabel.addEventListener('click', () => {
    const section = sectionLabel.parentElement;
    section.classList.toggle('closed');
    setTimeout(() => {
      if (sectionLabel === document.activeElement) {
        sectionLabel.blur();
      }
    }, 250);
  });
});
