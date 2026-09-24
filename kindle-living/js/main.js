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

  function showStep(i) {
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

// ---------- Reviews: horizontal scroll reveal ----------
const reviewsSection = document.getElementById('reviews');
const reviewsViewport = document.getElementById('reviewsViewport');
const reviewsTrack = document.getElementById('reviewsTrack');
if (reviewsSection && reviewsViewport && reviewsTrack) {
  let reviewsTicking = false;

  const updateReviewsScroll = () => {
    reviewsTicking = false;
    const maxShift = reviewsTrack.scrollWidth - reviewsViewport.clientWidth;
    if (maxShift <= 0) {
      reviewsTrack.style.transform = 'translateX(0)';
      return;
    }
    const rect = reviewsViewport.getBoundingClientRect();
    // 0 while the card row is still entering (or its top hasn't yet reached
    // the top of the viewport) — first card fully visible.
    // 1 after scrolling a further fixed distance past that point — last
    // card fully visible well before the row scrolls out of view.
    const REVEAL_DISTANCE = 420;
    const progress = -rect.top / REVEAL_DISTANCE;
    const clamped = Math.min(1, Math.max(0, progress));
    reviewsTrack.style.transform = `translateX(-${clamped * maxShift}px)`;
  };

  const onReviewsScroll = () => {
    if (!reviewsTicking) {
      reviewsTicking = true;
      requestAnimationFrame(updateReviewsScroll);
    }
  };

  window.addEventListener('scroll', onReviewsScroll, { passive: true });
  window.addEventListener('resize', updateReviewsScroll);
  updateReviewsScroll();
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
