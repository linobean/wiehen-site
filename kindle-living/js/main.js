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

// ---------- Product data ----------
// Replace name/category/gradient with real product info + photography.
const products = [
  { name: 'Allison',  category: 'heat',       swatch: 'grad-1' },
  { name: 'Marlowe',  category: 'heat',       swatch: 'grad-2' },
  { name: 'Sutton',   category: 'heat',       swatch: 'grad-3' },
  { name: 'Harlow',   category: 'heat-light', swatch: 'grad-4' },
  { name: 'Bexley',   category: 'heat-light', swatch: 'grad-5' },
  { name: 'Winslow',  category: 'light',      swatch: 'grad-1' },
  { name: 'Adair',    category: 'light',      swatch: 'grad-2' },
  { name: 'Rowan',    category: 'heat',       swatch: 'grad-3' },
];

const grid = document.getElementById('productGrid');
const filterLabels = { all: 'All', heat: 'Heat', 'heat-light': 'Heat & Light', light: 'Light' };

function renderProducts(filter) {
  if (!grid) return;
  grid.innerHTML = '';
  products
    .filter(p => filter === 'all' || p.category === filter)
    .forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-thumb ${p.swatch}">
          ${p.name}
          <button class="save-btn" aria-label="Save ${p.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="#211d18" stroke-width="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <span class="tag">${filterLabels[p.category]}</span>
        </div>
      `;
      grid.appendChild(card);
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

renderProducts('all');

// ---------- Featured product swatches ----------
document.querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
  });
});

const saveAllison = document.getElementById('saveAllison');
if (saveAllison) {
  saveAllison.addEventListener('click', () => {
    saveAllison.textContent = saveAllison.textContent.trim() === 'Save' ? 'Saved' : 'Save';
  });
}

// ---------- Quote request options ----------
const quoteOptions = document.querySelectorAll('.quote-option');
const quoteStatus = document.getElementById('quoteStatus');
quoteOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    quoteOptions.forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    if (quoteStatus) {
      quoteStatus.textContent = `Thanks — we'll follow up about "${opt.dataset.option}". (Wire this up to your real form/email flow.)`;
    }
  });
});

// ---------- Hero image slider ----------
const sliderTrack = document.getElementById('sliderTrack');
if (sliderTrack) {
  const slides = Array.from(sliderTrack.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let current = 0;
  let timer = null;
  const INTERVAL = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

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
    timer = setInterval(next, INTERVAL);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
