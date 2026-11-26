// Projects slider (#work): arrows, ← → keys, swipe, #project links.
// The Lottie player (and its WebAssembly) only loads when a slide with a Lottie is first shown.
const root = document.querySelector('.projects');

if (root) {
  const slides = [...root.querySelectorAll('.project')];
  const titleEl = root.querySelector('[data-title]');
  const descEl = root.querySelector('[data-desc]');
  const statusEl = root.querySelector('[data-status]');
  let lottieReady = null;
  let i = Math.max(0, slides.findIndex((s) => '#' + s.id === location.hash));

  const loadLottie = () => {
    lottieReady ||= import('./vendor/dotlottie-wc.js').then(({ setWasmUrl }) => {
      setWasmUrl(new URL('./vendor/dotlottie-player.wasm', import.meta.url).href);
    });
    return lottieReady;
  };

  const show = (n, dir = 0) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-active', on);
      s.hidden = !on;
      if (on) s.style.setProperty('--from', dir < 0 ? '-24px' : '24px');
    });
    const s = slides[i];
    titleEl.textContent = s.dataset.title;
    descEl.textContent = s.dataset.desc;
    statusEl.textContent = `Project ${i + 1} of ${slides.length}: ${s.querySelector('h3').textContent}`;
    s.querySelectorAll('template[data-lottie]').forEach((t) => {
      loadLottie().then(() => t.replaceWith(t.content.cloneNode(true)));
    });
    if (dir) history.replaceState(null, '', '#' + s.id);
  };

  const go = (dir) => {
    const top = root.getBoundingClientRect().top;
    show(i + dir, dir);
    if (top < 0) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  root.querySelector('[data-prev]').addEventListener('click', () => go(-1));
  root.querySelector('[data-next]').addEventListener('click', () => go(1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });

  let x0 = null;
  root.addEventListener('touchstart', (e) => {
    x0 = e.target.closest('.project__media') ? e.touches[0].clientX : null;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });

  show(i);
}
