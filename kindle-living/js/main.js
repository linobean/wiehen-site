// ---------- Sticky nav shrink on scroll ----------
const siteNav = document.querySelector('header.site-nav');
if (siteNav) {
  const SCROLL_THRESHOLD = 10;
  const updateNavScrolled = () => {
    siteNav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  updateNavScrolled();
  window.addEventListener('scroll', updateNavScrolled, { passive: true });
}

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---------- Personalized quote quiz ----------
const qfForm = document.getElementById('quoteForm');
if (qfForm) {
  const steps = Array.from(qfForm.querySelectorAll('.qf-step'));
  const barFill = document.getElementById('qfBarFill');
  const countEl = document.getElementById('qfCount');
  const backBtn = document.getElementById('qfBack');
  const nextBtn = document.getElementById('qfNext');
  const submitBtn = document.getElementById('qfSubmit');
  const doneMsg = document.getElementById('qfDone');
  const total = steps.length;
  let current = 0;

  // Saved products: shown under "What caught your eye?" when the visitor has saved anything.
  // Rebuilt each time the step changes, so items saved since the page loaded are included.
  const savedBox = document.getElementById('qfSaved');
  const savedThumbs = document.getElementById('qfSavedThumbs');
  const savedInput = document.getElementById('qfSavedInput');
  // product images are stored relative to the site root; product pages sit one folder down
  const assetPrefix = (document.querySelector('.kvf-logo img, .logo img')?.getAttribute('src') || '').replace(/images\/.*$/, '');
  function renderSavedProducts() {
    if (!savedBox || typeof kindleGetSavedIds !== 'function') return;
    const ids = kindleGetSavedIds();
    savedBox.hidden = ids.length === 0;
    savedThumbs.innerHTML = '';
    ids.forEach((id) => {
      const p = KINDLE_PRODUCTS[id];
      const img = document.createElement('img');
      img.src = assetPrefix + p.image;
      img.alt = p.name;
      img.title = p.name;
      savedThumbs.appendChild(img);
    });
    savedInput.value = ids.map((id) => KINDLE_PRODUCTS[id].name).join(', ');
  }

  function showStep(i) {
    renderSavedProducts();
    steps.forEach((step, idx) => step.classList.toggle('is-on', idx === i));
    barFill.style.width = `${((i + 1) / total) * 100}%`;
    countEl.textContent = `${i + 1} / ${total}`;
    backBtn.hidden = i === 0;
    const isLast = i === total - 1;
    nextBtn.hidden = isLast;
    submitBtn.hidden = !isLast;
  }

  qfForm.querySelectorAll('.qf-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.qf-opts');
      group.querySelectorAll('.qf-opt').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      if (current < total - 1) {
        current += 1;
        showStep(current);
      }
    });
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) {
      current -= 1;
      showStep(current);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current < total - 1) {
      current += 1;
      showStep(current);
    }
  });

  qfForm.addEventListener('submit', (e) => {
    e.preventDefault();
    qfForm.querySelector('.qf-stage').hidden = true;
    qfForm.querySelector('.qf-bar').hidden = true;
    qfForm.querySelector('.qf-nav').hidden = true;
    doneMsg.hidden = false;
  });

  showStep(0);
}

// ---------- Hero image slider ----------
const sliderTrack = document.getElementById('sliderTrack');
if (sliderTrack) {
  const desktopSlides = Array.from(sliderTrack.querySelectorAll('.slide:not(.slide-mobile)'));
  const mobileSlides = Array.from(sliderTrack.querySelectorAll('.slide.slide-mobile'));
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const mobileQuery = window.matchMedia('(max-width: 640px)');
  const INTERVAL = 5000;

  let slides = [];
  let dots = [];
  let current = 0;
  let timer = null;

  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    dots = Array.from(dotsWrap.querySelectorAll('.dot'));
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    if (slides.length > 1) timer = setInterval(next, INTERVAL);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  function useSlideSet(useMobile) {
    desktopSlides.forEach(s => s.classList.remove('active'));
    mobileSlides.forEach(s => s.classList.remove('active'));
    slides = useMobile ? mobileSlides : desktopSlides;
    current = 0;
    if (slides.length) slides[0].classList.add('active');
    buildDots();
  }

  useSlideSet(mobileQuery.matches);

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    // Swipe left/right to change slides (ignores mostly-vertical drags so the page still scrolls)
    let touchX = 0;
    let touchY = 0;
    heroSlider.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      stopAutoplay();
    }, { passive: true });
    heroSlider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
      startAutoplay();
    });
  }

  const handleBreakpointChange = (e) => {
    useSlideSet(e.matches);
    startAutoplay();
  };
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', handleBreakpointChange);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(handleBreakpointChange);
  }

  startAutoplay();
}

// ---------- Product navigator (hero-adjacent interactive gallery) ----------
const pnRow = document.getElementById('pnRow');
if (pnRow) {
  const pnCategory = {
    aria: ['heat'], bryn: ['heat'], cove: ['heat'], dune: ['heat'],
    echo: ['heat', 'heat-light'], fjord: ['heat', 'heat-light'],
    glow: ['light'], halo: ['light'],
  };
  const pnProducts = Array.from(pnRow.querySelectorAll('.pn-product'));
  const pnTags = Array.from(document.querySelectorAll('.pn-tag'));
  const pnNames = Array.from(document.querySelectorAll('.pn-name'));
  const pnDescs = Array.from(document.querySelectorAll('.pn-desc'));
  const pnFilterBtns = Array.from(document.querySelectorAll('.pn-filter'));

  let pnFilter = 'all';
  let pnHoverId = pnProducts[0]?.dataset.id || null;

  function pnVisibleIds() {
    return pnProducts
      .filter(btn => pnFilter === 'all' || pnCategory[btn.dataset.id].includes(pnFilter))
      .map(btn => btn.dataset.id);
  }

  function pnRender() {
    const visible = pnVisibleIds();
    const activeId = (pnHoverId && visible.includes(pnHoverId)) ? pnHoverId : visible[0];

    pnProducts.forEach(btn => {
      const id = btn.dataset.id;
      const dimmed = pnFilter !== 'all' && !pnCategory[id].includes(pnFilter);
      btn.classList.toggle('dim', dimmed);
      btn.classList.toggle('is-active', id === activeId);
    });
    [...pnTags, ...pnNames, ...pnDescs].forEach(el => {
      el.classList.toggle('show', el.dataset.id === activeId);
    });
  }

  pnFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pnFilter = btn.dataset.filter;
      pnFilterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      pnRender();
    });
  });

  pnProducts.forEach(btn => {
    const id = btn.dataset.id;
    const setHover = () => {
      if (btn.classList.contains('dim')) return;
      pnHoverId = id;
      pnRender();
    };
    btn.addEventListener('mouseenter', setHover);
    btn.addEventListener('focus', setHover);
    btn.addEventListener('click', setHover);
  });

  pnRender();

  // ---------- Save button ----------
  document.querySelectorAll('.pn-save-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (kindleIsSaved(id)) {
      btn.classList.add('saved');
      btn.querySelector('.pn-save-label').textContent = 'Saved';
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const saved = kindleToggleSaved(id);
      btn.classList.toggle('saved', saved);
      btn.querySelector('.pn-save-label').textContent = saved ? 'Saved' : 'Save';
    });
  });
  kindleUpdateSavedBadge();
}

// ---------- Looping carousels (Reviews and the press quotes) ----------
// Slides one item to the left every AUTOPLAY_MS while the carousel is on screen, and loops endlessly.
// Arrows, dots, swipe and the arrow keys move it too; hovering or focusing pauses it.
// Markup: root > [data-track] > [data-slide] items, .reviews-arrow-prev/-next buttons, [data-dots].
function initLoopCarousel(root, { slidePercent, visibleCount, label, maxSlides = Infinity }) {
  const track = root.querySelector('[data-track]');
  const dotsWrap = root.querySelector('[data-dots]');
  const slides = Array.from(track.querySelectorAll('[data-slide]')).slice(0, maxSlides);
  const count = slides.length;
  const CLONES = 3; // enough copies at each end to loop seamlessly with up to 3 items visible
  const AUTOPLAY_MS = 6000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Copies of the last items go before the first and copies of the first items after the last,
  // so the row can keep sliding and then jump back invisibly.
  for (let i = 0; i < CLONES; i++) {
    const tail = slides[(count - 1 - i + count * CLONES) % count].cloneNode(true);
    const head = slides[i % count].cloneNode(true);
    [tail, head].forEach((c) => { c.setAttribute('aria-hidden', 'true'); c.removeAttribute('data-slide'); });
    track.insertBefore(tail, track.firstChild);
    track.appendChild(head);
  }

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'reviews-dot';
    dot.setAttribute('aria-label', `Show ${label} ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i + CLONES); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  let index = CLONES; // position in the track including the leading copies
  let moving = false;
  let timer = null;
  let inView = false;
  let settleTimer = null;

  function goTo(i, animate = true) {
    const w = slidePercent();
    // When an item is narrower than the row (reviews on tablet) it is centred; otherwise it starts at the left
    const offset = visibleCount() === 1 && w < 100 ? (100 - w) / 2 : 0;
    track.style.transition = animate && !reduceMotion ? 'transform 0.5s ease-in-out' : 'none';
    moving = animate && !reduceMotion;
    index = i;
    track.style.transform = `translateX(${offset - index * w}%)`;
    // Fallback in case transitionend never fires (e.g. background tab)
    clearTimeout(settleTimer);
    if (moving) settleTimer = setTimeout(() => { moving = false; settle(); }, 600);
    const active = ((index - CLONES) % count + count) % count;
    dots.forEach((d, n) => d.classList.toggle('active', n === active));
    if (!moving) settle();
  }

  // After sliding onto a copy, jump to the real item it copies
  function settle() {
    if (index < CLONES) goTo(index + count, false);
    else if (index >= CLONES + count) goTo(index - count, false);
  }
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    clearTimeout(settleTimer);
    moving = false;
    settle();
  });

  const next = () => { if (!moving) goTo(index + 1); };
  const prev = () => { if (!moving) goTo(index - 1); };

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (inView && !reduceMotion && count > visibleCount()) timer = setInterval(next, AUTOPLAY_MS);
  }
  function restart() { start(); }

  root.querySelector('.reviews-arrow-prev').addEventListener('click', () => { prev(); restart(); });
  root.querySelector('.reviews-arrow-next').addEventListener('click', () => { next(); restart(); });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); restart(); }
    if (e.key === 'ArrowRight') { next(); restart(); }
  });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  let touchX = 0;
  let touchDX = 0;
  root.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; touchDX = 0; stop(); }, { passive: true });
  root.addEventListener('touchmove', (e) => { touchDX = e.touches[0].clientX - touchX; }, { passive: true });
  root.addEventListener('touchend', () => {
    if (Math.abs(touchDX) > 50) (touchDX < 0 ? next : prev)();
    start();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { goTo(index, false); start(); }, 150);
  });

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    inView ? start() : stop();
  }).observe(root);

  goTo(index, false);
}

const reviewsCarousel = document.getElementById('reviewsCarousel');
if (reviewsCarousel) {
  initLoopCarousel(reviewsCarousel, {
    label: 'review',
    maxSlides: 10,
    slidePercent: () => (window.innerWidth >= 1100 ? 100 / 3 : window.innerWidth >= 768 ? 70 : 100),
    visibleCount: () => (window.innerWidth >= 1100 ? 3 : 1),
  });
}

const pressCarousel = document.getElementById('pressCarousel');
if (pressCarousel) {
  initLoopCarousel(pressCarousel, {
    label: 'press quote',
    slidePercent: () => 100,
    visibleCount: () => 1,
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Scroll reveal: blocks slide up into place as they scroll into view ----------
// Each group is watched as a whole; when it comes on screen its items rise in one after another.
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const groups = [
    ['#about .story', '.copy > *, .art'],
    ['#awards .section-head', ':scope > *'],
    ['#awards .awards-row', '.award-chip'],
    ['.category-feature .cf-grid', '.cf-media, .cf-content > *'],
    ['#testimonial .container', ':scope > *'],
    ['.press-quote .container', ':scope > *'],
  ];
  const STAGGER = 0.08; // seconds between items in a group
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  groups.forEach(([groupSel, itemSel]) => {
    document.querySelectorAll(groupSel).forEach((group) => {
      group.querySelectorAll(itemSel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(i * STAGGER, 0.6)}s`);
      });
      io.observe(group);
    });
  });
})();

// ---------- Product page: animated heat-ray arrows over the heat-radius photo ----------
// Needs js/vendor/lottie_light.min.js and the page's ray data (window.KL_HEAT_RAYS).
// Plays on a loop while on screen; stays off for visitors who prefer reduced motion.
(() => {
  const box = document.querySelector('.pd-heat-radius-rays');
  if (!box || !window.lottie || !window.KL_HEAT_RAYS) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const anim = lottie.loadAnimation({
    container: box,
    renderer: 'svg',
    loop: true,
    autoplay: false,
    animationData: window.KL_HEAT_RAYS,
    // stretch to fill the overlay box (full width, lower two-thirds of the photo) at any size
    rendererSettings: { preserveAspectRatio: 'none' },
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? anim.play() : anim.pause();
    }, { threshold: 0.25 }).observe(box);
  } else {
    anim.play();
  }
})();

// ---------- Trade Program application form (trade.html) ----------
// No backend yet: on submit the form is swapped for a thank-you message, like the quote form.
const tradeForm = document.getElementById('tradeForm');
if (tradeForm) {
  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tradeForm.hidden = true;
    document.getElementById('tradeDone').hidden = false;
  });
}

// ---------- About dropdown in the nav ----------
// The menu opens on hover and keyboard focus (CSS); clicking "About" goes to the About page.
// Escape closes it while tabbing through.
document.querySelectorAll('.nav-dropdown').forEach((dd) => {
  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dd.contains(document.activeElement)) document.activeElement.blur();
  });
});

// ---------- Logo: always land at the very top of the homepage ----------
// From other pages the link loads the homepage at the top. On the homepage itself it scrolls
// back to the top (where the full-size nav and logo show) instead of reloading.
document.querySelectorAll('a.logo, a.kvf-logo').forEach((logo) => {
  logo.addEventListener('click', (e) => {
    const page = (path) => path.replace(/index\.html$/, '');  // "/kindle-living/" and ".../index.html" are the same page
    const target = new URL(logo.href, location.href);
    if (page(target.pathname) !== page(location.pathname)) return;
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
});

// ---------- Arriving at a #section link (e.g. awards.html#adex from the homepage badges) ----------
// The site uses smooth scrolling, which can leave a page short of its target on load,
// so once everything has loaded, jump straight to the linked section.
window.addEventListener('load', () => {
  if (!location.hash) return;
  let target = null;
  try { target = document.querySelector(location.hash); } catch (e) { return; }
  if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
});
