(() => {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const velocity = { value: 0, smoothed: 0 };

  let lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    if (ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    lenis.on('scroll', (e) => {
      velocity.value = e.velocity || 0;
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      });
    });
  } else {
    let lastY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        velocity.value = y - lastY;
        lastY = y;
      },
      { passive: true }
    );
  }

  gsap.ticker.add(() => {
    velocity.smoothed += (velocity.value - velocity.smoothed) * 0.08;
    velocity.value *= 0.92;
  });

  if (!ScrollTrigger) return;

  const hero = document.querySelector('.hero-section');
  if (hero) {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
    gsap.to('.hero-section .title', {
      yPercent: 70,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    gsap.to('.hero-section .subtitle', {
      yPercent: 45,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    gsap.to(videoContainer, {
      yPercent: 10,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'max',
        scrub: 0.6,
      },
    });
  }

  gsap.utils.toArray('.section-title').forEach((titleEl) => {
    const fromLeft = Math.abs(titleEl.offsetLeft) % 2 === 0;
    gsap.fromTo(
      titleEl,
      { x: fromLeft ? -90 : 90 },
      {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: titleEl,
          start: 'top 85%',
          end: 'top 45%',
          scrub: true,
        },
      }
    );
  });

  const track = document.querySelector('.flow-track');
  const flowSection = document.querySelector('.flow-section');
  if (track && flowSection) {
    const getDistance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: flowSection,
        start: 'top top',
        end: () => `+=${getDistance() + window.innerHeight * 0.6}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  const wideCard = document.querySelector('.wide-card');
  if (wideCard) {
    gsap.to(wideCard, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.conservation-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  const overlay = document.querySelector('.video-overlay');
  if (overlay) {
    gsap.to(overlay, {
      filter: 'brightness(0.72) saturate(1.15) hue-rotate(14deg)',
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 0.5,
      },
    });
  }

  const ring = document.createElement('div');
  ring.className = 'scroll-ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML =
    '<svg viewBox="0 0 36 36"><circle class="ring-track" cx="18" cy="18" r="15.5"/><circle class="ring-fill" cx="18" cy="18" r="15.5"/></svg>';
  document.body.appendChild(ring);

  const ringFill = ring.querySelector('.ring-fill');
  const CIRCUMFERENCE = 2 * Math.PI * 15.5;
  ringFill.style.strokeDasharray = CIRCUMFERENCE;
  ringFill.style.strokeDashoffset = CIRCUMFERENCE;

  const updateRing = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? window.scrollY / total : 0;
    ringFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  };
  updateRing();
  window.addEventListener('scroll', updateRing, { passive: true });

  const tiltCards = document.querySelectorAll('.ecosystem-card, .resource-card');
  tiltCards.forEach((card) => {
    gsap.set(card, { transformPerspective: 800, transformOrigin: 'center center' });
  });

  gsap.ticker.add(() => {
    const tilt = Math.max(-4, Math.min(4, velocity.smoothed * 0.08));
    if (Math.abs(tilt) < 0.05) return;
    tiltCards.forEach((card) => {
      gsap.to(card, { rotationZ: tilt, duration: 0.25, overwrite: 'auto' });
    });
  });
})();
