/* =========================
   CATEGORY (FULL) - JS
   Click -> active yellow (icon + text + bg)
   ========================= */

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
    // responsive icons
    Kiosk.categoryUi.applyResponsive();
    if (!this._resizeBound) {
      window.addEventListener("resize", Kiosk.categoryUi.applyResponsive);
      this._resizeBound = true;
    }

    // wrapper
    const slot = document.getElementById("slot-category");
    if (!slot) {
      console.warn("❌ slot-category not found. Add id='slot-category' around category buttons.");
      return;
    }

    // click (event delegation)
    slot.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-category-id]");
      if (!btn) return;

      const id = btn.dataset.categoryId;

      // save state (optional)
      Kiosk.state = Kiosk.state || {};
      Kiosk.state.catalog = Kiosk.state.catalog || {};
      Kiosk.state.catalog.categoryId = id;
      Kiosk.state.catalog.subCategoryId = null;

      // activate UI
      this.updateActive(id);

      // refresh dependents if exist
      if (Kiosk.subCategory?.render) Kiosk.subCategory.render();
      if (Kiosk.product?.render) Kiosk.product.render();

      console.log("✅ Active category:", id);
    });

    // initial active (auto select first if none)
    const current = Kiosk.state?.catalog?.categoryId;
    if (current) {
      this.updateActive(current);
    } else {
      const firstBtn = slot.querySelector("button[data-category-id]");
      if (firstBtn) {
        const id = firstBtn.dataset.categoryId;
        Kiosk.state = Kiosk.state || {};
        Kiosk.state.catalog = Kiosk.state.catalog || {};
        Kiosk.state.catalog.categoryId = id;
        this.updateActive(id);
      }
    }
  },

  updateActive(activeId) {
    // reset only inside slot (safer)
    const slot = document.getElementById("slot-category");
    if (!slot) return;

    slot.querySelectorAll("button[data-category-id]").forEach(b => {
      b.classList.remove("category-active");
    });

    const activeBtn = slot.querySelector(`button[data-category-id="${activeId}"]`);
    if (activeBtn) activeBtn.classList.add("category-active");
  }
};

/* Call this AFTER the category UI is rendered */
Kiosk.category.init();
