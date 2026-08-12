// "Take the Pledge" interaction — self-contained module.
// On click: celebrates briefly, then gently guides the reader to the
// conservation call-to-action below.

const btn = document.getElementById('involvement-cta-btn');

if (btn) {
  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = 'Thank you for caring 🌍';
    btn.setAttribute('aria-live', 'polite');

    setTimeout(() => {
      btn.textContent = original;
    }, 2500);

    document.getElementById('conservation')?.scrollIntoView({ behavior: 'smooth' });
  });
}
