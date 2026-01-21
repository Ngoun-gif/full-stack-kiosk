window.Kiosk = window.Kiosk || {};

Kiosk.subCategory = {
  init() {
    this.render();

    const slot = document.getElementById("slot-sub-category");
    if (!slot) return;

    slot.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sub-category-id]");
      if (!btn) return;

      const id = btn.dataset.subCategoryId;
      Kiosk.state.catalog.subCategoryId = id;

      this.updateActive(id);
      Kiosk.product.render();
    });
  },

  render() {
    const slot = document.getElementById("slot-sub-category");
    const container = document.getElementById("subcat-items");
    if (!slot || !container) return;

    const catId = Kiosk.state.catalog.categoryId;
    const subcats = Kiosk.data.subCategories[catId] || [];

    // RULE: show only if >= 2
    if (subcats.length < 2) {
      slot.classList.add("d-none");
      Kiosk.state.catalog.subCategoryId = null;
      container.innerHTML = "";
      return;
    }

    slot.classList.remove("d-none");

    const items = [{ id: "all", name: "All" }, ...subcats];

    if (Kiosk.state.catalog.subCategoryId === null) {
      Kiosk.state.catalog.subCategoryId = "all";
    }

    container.innerHTML = items.map(x => `
      <div class="col-auto">
        <button class="btn p-0 border-0 bg-transparent"
                type="button"
                data-sub-category-id="${x.id}">
          <span class="subcat-pill px-4 py-2 rounded-pill fw-semibold d-inline-block bg-warning text-dark">
            ${x.name}
          </span>
        </button>
      </div>
    `).join("");

    this.updateActive(Kiosk.state.catalog.subCategoryId);
  },

  updateActive(activeId) {
    document.querySelectorAll("[data-sub-category-id] .subcat-pill").forEach(p => {
      p.classList.remove("bg-white", "border");
      p.classList.add("bg-warning", "text-dark");
    });

    const active = document.querySelector(`[data-sub-category-id="${activeId}"] .subcat-pill`);
    if (active) {
      active.classList.remove("bg-warning");
      active.classList.add("bg-white", "border");
    }
  }
};
