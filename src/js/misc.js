// update --full-height CSS variable to JS window.innerHeight instead of CSS 100vh
const updateFullHeightVariable = () => {
  document.body.setAttribute('style', `--full-height: ${window.innerHeight}px;`);
};
window.addEventListener('load', updateFullHeightVariable);
window.addEventListener('resize', updateFullHeightVariable);
