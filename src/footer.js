// Footer and page-utility interactions: journey button, back-to-top,
// and auto-updating copyright year. Self-contained module.

const journeyBtn = document.getElementById('journey-btn');
journeyBtn?.addEventListener('click', () => {
  document.getElementById('ecosystems')?.scrollIntoView({ behavior: 'smooth' });
});

const backToTop = document.getElementById('back-to-top');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const updateBackToTop = () => {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 600);
};
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
