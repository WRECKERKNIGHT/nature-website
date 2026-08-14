// Animated count-up for the "Nature in numbers" stats section.
// Starts only when the section enters the viewport (IntersectionObserver),
// respects prefers-reduced-motion, and supports decimal + suffix values.

const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateStat(el) {
  const target = parseFloat(el.dataset.target || '0');
  const suffix = el.dataset.suffix || '';
  const decimals = String(el.dataset.target || '').includes('.') ? 1 : 0;
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  };

  if (prefersReducedMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
    return;
  }
  requestAnimationFrame(tick);
}

function initStats() {
  const values = document.querySelectorAll('.stat-value');
  if (!values.length) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    values.forEach(animateStat);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStat(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  values.forEach((el) => observer.observe(el));
}

initStats();
