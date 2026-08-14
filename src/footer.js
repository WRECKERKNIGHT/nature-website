// Footer and page-utility interactions: journey button, back-to-top,
// and auto-updating copyright year. Self-contained module.

const journeyBtn = document.getElementById('journey-btn');
journeyBtn?.addEventListener('click', () => {
  document.getElementById('ecosystems')?.scrollIntoView({ behavior: 'smooth' });
});

// Smooth-scroll in-page anchors (nav + footer). The site relies on
// ScrollTrigger pins, which break with a global CSS `scroll-behavior: smooth`,
// so anchor navigation is handled here instead — and respects reduced motion.
const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
