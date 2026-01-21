window.Kiosk = window.Kiosk || {};

Kiosk.categoryUi = {
  applyResponsive() {
    const portrait = window.innerHeight >= window.innerWidth;
    document.querySelectorAll(".cat-icon").forEach(el => {
      el.classList.toggle("d-none", !portrait);
    });
  }
};

Kiosk.category = {
  init() {
    this.render();
    Kiosk.categoryUi.applyResponsive();

    if (!this._resizeBound) {
      window.addEventListener("resize", Kiosk.categoryUi.applyResponsive);
      this._resizeBound = true;
    }

    const slot = document.getElementById("slot-category");
    if (!slot) return;

    slot.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category-id]");
      if (!btn) return;

      const id = btn.dataset.categoryId;

      Kiosk.state.catalog.categoryId = id;
      Kiosk.state.catalog.subCategoryId = null;

      this.updateActive(id);

      Kiosk.subCategory.render();
      Kiosk.product.render();
    });

    this.updateActive(Kiosk.state.catalog.categoryId);
  },

  render() {
    const container = document.getElementById("category-items");
    if (!container) return;

    container.innerHTML = Kiosk.data.categories.map(c => `
      <div class="col">
        <button class="btn btn-link text-decoration-none w-100 py-2"
                type="button"
                data-category-id="${c.id}">
          <div class="mb-1 cat-icon">
            <img src="${c.icon}" alt="${c.name}" style="height:56px;">
          </div>
          <span class="fw-semibold text-dark category-item">${c.name}</span>
        </button>
      </div>
    `).join("");
  },

  updateActive(activeId) {
    document.querySelectorAll("[data-category-id] .category-item").forEach(el => {
      el.classList.remove("text-warning");
      el.classList.add("text-dark");
    });

    const active = document.querySelector(`[data-category-id="${activeId}"] .category-item`);
    if (active) {
      active.classList.remove("text-dark");
      active.classList.add("text-warning");
    }
  }
};
