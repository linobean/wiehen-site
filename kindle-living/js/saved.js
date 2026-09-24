// ---------- Saved products page ----------
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('savedGrid');
  const empty = document.getElementById('savedEmpty');
  if (!grid || !empty) return;

  function render() {
    const ids = kindleGetSavedIds();

    if (ids.length === 0) {
      grid.style.display = 'none';
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';
    grid.innerHTML = ids.map(id => {
      const p = KINDLE_PRODUCTS[id];
      if (!p) return '';
      return `
        <div class="saved-card">
          <div class="saved-card-media"><img src="${p.image}" alt="${p.name}"></div>
          <div class="saved-card-body">
            <span class="saved-card-tag">${p.tag}</span>
            <h3 class="saved-card-name">${p.name}</h3>
            <p class="saved-card-desc">${p.desc}</p>
            <div class="saved-card-actions">
              <a class="saved-card-view" href="index.html#product-nav">View in collection</a>
              <button class="saved-card-remove" data-id="${id}" aria-label="Remove ${p.name} from saved">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.saved-card-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        kindleToggleSaved(btn.dataset.id);
        render();
      });
    });
  }

  render();
});
