(() => {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero drifts gently away while scrolling out of view
  const hero = document.querySelector('.hero-section');
  if (hero) {
    gsap.to('.hero-section .hero-content', {
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    gsap.to('.hero-section .title', {
      yPercent: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    gsap.to('.hero-section .subtitle', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Background video parallax
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    gsap.to(videoContainer, {
      yPercent: 8,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'max',
        scrub: 0.5,
      },
    });
  }

  // Journey cards rise in with a stagger, like the other card grids
  gsap.utils.toArray('.flow-track').forEach((grid) => {
    gsap.from(grid.children, {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Conservation card parallax
  const wideCard = document.querySelector('.wide-card');
  if (wideCard) {
    gsap.to(wideCard, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.conservation-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Overlay drifts from daylight to a subtle dusk tone across the page
  const overlay = document.querySelector('.video-overlay');
  if (overlay) {
    gsap.to(overlay, {
      filter: 'brightness(0.78) saturate(1.12) hue-rotate(10deg)',
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 0.5,
      },
    });
  }
})();
