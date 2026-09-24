// Shared product data + saved-items store, used by the product navigator (index.html)
// and the saved-items page (saved.html).

const KINDLE_PRODUCTS = {
  aria: {
    name: 'Allison',
    tag: 'Outdoor heater',
    image: 'images/products/allison.png',
    desc: 'Keep it classic. Allison is the tried and true original - elevated outdoor heat.',
  },
  bryn: {
    name: 'Bella',
    tag: 'Outdoor heater',
    image: 'images/products/bella.png',
    desc: 'Anything but basic. Bella is heat with an attention grabbing design.',
  },
  cove: {
    name: 'Caroline',
    tag: 'Outdoor heater',
    image: 'images/products/caroline.png',
    desc: 'Caroline is a streamlined design providing elegant, fuss-free heat for properties with natural gas hook-ups.',
  },
  dune: {
    name: 'Sierra',
    tag: 'Outdoor heater',
    image: 'images/products/sierra.png',
    desc: 'Sierra is heat plus unparalleled execution and hand-tooled craftsmanship. The ultimate outdoor statement piece.',
  },
  echo: {
    name: 'Allison White Alabaster',
    tag: 'Heater + lamp',
    image: 'images/products/allison-white-alabaster.png',
    desc: 'Have it all. Allison is innovation and sophisticated styling providing the full heat and light experience.',
  },
  fjord: {
    name: 'Bella White Alabaster',
    tag: 'Heater + lamp',
    image: 'images/products/bella-white-alabaster.png',
    desc: 'Two in one. Providing both heat and light, Bella is a whimsical design providing the full heat and light experience.',
  },
  glow: {
    name: 'Lumen',
    tag: 'Lamp only',
    image: 'images/products/lumen.png',
    desc: 'Light done different. Lumen is a dimmable, white light, plug-in indoor/outdoor floor lamp.',
  },
  halo: {
    name: 'Blumen',
    tag: 'Lamp only',
    image: 'images/products/blumen.png',
    desc: 'Get lit. Blumen is a dimmable, white light, plug-in indoor/outdoor floor lamp.',
  },
};

const KINDLE_SAVED_KEY = 'kindleSavedProducts';

function kindleGetSavedIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(KINDLE_SAVED_KEY));
    return Array.isArray(raw) ? raw.filter(id => KINDLE_PRODUCTS[id]) : [];
  } catch (e) {
    return [];
  }
}

function kindleSetSavedIds(ids) {
  try {
    localStorage.setItem(KINDLE_SAVED_KEY, JSON.stringify(ids));
  } catch (e) {
    /* localStorage unavailable — badge/save state just won't persist */
  }
  kindleUpdateSavedBadge();
}

function kindleIsSaved(id) {
  return kindleGetSavedIds().includes(id);
}

function kindleToggleSaved(id) {
  const ids = kindleGetSavedIds();
  const idx = ids.indexOf(id);
  if (idx === -1) ids.push(id);
  else ids.splice(idx, 1);
  kindleSetSavedIds(ids);
  return ids.includes(id);
}

function kindleUpdateSavedBadge() {
  const link = document.getElementById('navSaved');
  const badge = document.getElementById('savedCount');
  if (!link || !badge) return;
  const n = kindleGetSavedIds().length;
  badge.textContent = n;
  link.classList.toggle('has-items', n > 0);
}

document.addEventListener('DOMContentLoaded', kindleUpdateSavedBadge);
