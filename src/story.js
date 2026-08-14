(() => {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ================= 1. SCROLL-LOCKED STORY ================= */
  const storySection = document.querySelector('.story-section');
  if (storySection) {
    const chapters = gsap.utils.toArray('.story-chapter', storySection);
    const total = chapters.length;
    const currentEl = storySection.querySelector('.story-current');
    const fillEl = storySection.querySelector('.story-fill');

    if (total) {
      storySection.classList.add('js-story');

      const splitWords = (chapter) => {
        const line = chapter.querySelector('.story-line');
        if (!line || line.dataset.split) return;
        line.dataset.split = '1';
        const frag = document.createDocumentFragment();
        line.textContent.trim().split(/\s+/).forEach((word) => {
          const span = document.createElement('span');
          span.className = 'story-word';
          span.textContent = word;
          frag.appendChild(span);
          frag.appendChild(document.createTextNode(' '));
        });
        line.replaceChildren(frag);
      };

      let active = -1;
      const setChapter = (idx) => {
        if (idx === active) return;
        if (active >= 0) {
          const prev = chapters[active];
          gsap.to(prev, { opacity: 0, y: -40, scale: 0.98, duration: 0.4, ease: 'power2.in', overwrite: 'auto' });
          gsap.set(prev.querySelectorAll('.story-word'), { opacity: 0 });
        }
        active = idx;
        const cur = chapters[idx];
        splitWords(cur);
        gsap.fromTo(cur, { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(cur.querySelectorAll('.story-word'), { opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.12 });
        chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
        if (currentEl) currentEl.textContent = String(idx + 1).padStart(2, '0');
        if (fillEl) gsap.to(fillEl, { scaleX: (idx + 1) / total, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      };

      gsap.set(chapters, { opacity: 0 });
      setChapter(0);

      ScrollTrigger.create({
        trigger: storySection,
        start: 'top top',
        end: () => `+=${window.innerHeight * (total + 0.75)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          setChapter(Math.min(total - 1, Math.floor(self.progress * total)));
        },
      });
    }
  }

  /* ================= 2. MORPHING WORD ================= */
  const morphSection = document.querySelector('.morph-section');
  if (morphSection) {
    const wordEl = morphSection.querySelector('.morph-word');
    const words = (() => {
      try {
        return JSON.parse(wordEl.dataset.words || '[]');
      } catch (e) {
        return [];
      }
    })();

    if (words.length > 1) {
      let activeWord = 0;
      const setWord = (idx) => {
        if (idx === activeWord) return;
        activeWord = idx;
        gsap.to(wordEl, {
          opacity: 0,
          y: -22,
          scale: 0.94,
          filter: 'blur(6px)',
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            wordEl.textContent = words[idx];
            gsap.fromTo(
              wordEl,
              { opacity: 0, y: 22, scale: 1.05, filter: 'blur(6px)' },
              { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }
            );
          },
        });
      };

      gsap.set(wordEl, { opacity: 1 });

      ScrollTrigger.create({
        trigger: morphSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          setWord(Math.min(words.length - 1, Math.floor(self.progress * words.length)));
        },
      });
    }
  }

  /* ================= 3. KINETIC TYPE ================= */
  const band = document.querySelector('.kinetic-band');
  if (band) {
    gsap.utils.toArray('.kinetic-row', band).forEach((row) => {
      const speed = parseFloat(row.dataset.speed) || 1;
      row.innerHTML += row.innerHTML + row.innerHTML;
      const dir = speed >= 0 ? -1 : 1;
      gsap.fromTo(
        row,
        { x: 0 },
        {
          x: dir * (row.scrollWidth / 3),
          ease: 'none',
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }
})();
