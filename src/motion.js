// Motion extras: scroll progress bar, section reveals, and magnetic buttons.
// New motion is skipped for users who prefer reduced motion.

const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Scroll progress bar
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBar);

const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.transform = `scaleX(${pct / 100})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // 2. Section titles and intros drift up into view
  gsap.utils.toArray('.section-title, .involvement-intro').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // 3. Magnetic hover pull on primary buttons
  const magnets = document.querySelectorAll('.glass-btn');
  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: relX * 0.25, y: relY * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
});
