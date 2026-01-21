window.Kiosk = window.Kiosk || {};

Kiosk.variant = {
  product: null,
  qty: 1,
  selections: {}, // key -> optionId

  init() {
    const modal = document.getElementById("variant-modal");
    if (!modal || this._bound) return;

    modal.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-vg][data-vid]");
      if (!btn) return;

      const groupKey = btn.dataset.vg;
      const optId = btn.dataset.vid;

      this.selections[groupKey] = optId;
      this._updateGroupUI(groupKey);
      this._hideError();
      this._recalc();
    });

    this._bound = true;
  },

  open(product) {
    this.product = product;
    this.qty = 1;
    this.selections = {};

    document.getElementById("pv-title").textContent = product.name;
    document.getElementById("pv-base-price").textContent = Number(product.price).toFixed(2);
    document.getElementById("pv-image").src = product.image || "";
    document.getElementById("pv-qty").textContent = "1";

    this._renderOptions();

    // ✅ AUTO SELECT DEFAULT OPTIONS for required groups (first option)
    for (const group of Kiosk.data.variantGroups) {
      if (!group.required) continue;
      const first = group.options?.[0];
      if (!first) continue;

      this.selections[group.key] = first.id;
      this._updateGroupUI(group.key);
    }

    this._hideError();
    this._recalc();

    document.getElementById("variant-modal").classList.remove("d-none");
    this.init();
  },

  close() {
    const el = document.getElementById("variant-modal");
    if (el) el.classList.add("d-none");
  },

  inc() {
    this.qty += 1;
    document.getElementById("pv-qty").textContent = String(this.qty);
    this._recalc();
  },

  dec() {
    if (this.qty <= 1) return;
    this.qty -= 1;
    document.getElementById("pv-qty").textContent = String(this.qty);
    this._recalc();
  },

  addToCart() {
    const requiredGroups = Kiosk.data.variantGroups.filter(g => g.required);
    const missing = requiredGroups.some(g => !this.selections[g.key]);
    if (missing) {
      this._showError();
      return;
    }

    const calc = this._calcPrice();

    const item = {
      productId: this.product.id,
      name: this.product.name,

      // ✅ ADD IMAGE so checkout can show it
      image: this.product.image || "",

      qty: this.qty,
      basePrice: Number(this.product.price),
      selections: { ...this.selections },
      optionDelta: calc.deltaPerUnit,
      unitPrice: calc.unitPrice,
      lineTotal: calc.total
    };

    Kiosk.state.cart.items.push(item);
    Kiosk.cart.recalc();

    this.close();
    Kiosk.router.go("menu");
  },

  _renderOptions() {
    const wrap = document.getElementById("pv-options");
    if (!wrap) return;

    wrap.innerHTML = Kiosk.data.variantGroups.map(group => `
      <div class="mb-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <h5 class="fw-bold mb-0">${group.title}</h5>
          ${group.required ? `<span class="badge bg-danger">Required</span>` : ``}
        </div>

        <div class="row g-3">
          ${group.options.map(opt => `
            <div class="col-6">
              <button class="btn btn-light border w-100 py-4 fw-semibold"
                      type="button"
                      data-vg="${group.key}"
                      data-vid="${opt.id}">
                ${opt.label}
                ${opt.delta ? `<span class="badge bg-warning text-dark ms-2">+ $${Number(opt.delta).toFixed(2)}</span>` : ``}
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  },

  _updateGroupUI(groupKey) {
    const selectedId = this.selections[groupKey];

    document.querySelectorAll(`[data-vg="${groupKey}"]`).forEach(btn => {
      btn.classList.remove("bg-warning");
      btn.classList.add("btn-light", "border");
    });

    const active = document.querySelector(`[data-vg="${groupKey}"][data-vid="${selectedId}"]`);
    if (active) {
      active.classList.remove("btn-light");
      active.classList.add("bg-warning");
    }
  },

  _calcPrice() {
    const base = Number(this.product.price);
    let delta = 0;

    for (const group of Kiosk.data.variantGroups) {
      const chosen = this.selections[group.key];
      if (!chosen) continue;
      const opt = group.options.find(o => o.id === chosen);
      if (opt) delta += Number(opt.delta || 0);
    }

    const unitPrice = base + delta;
    const total = unitPrice * this.qty;

    return {
      deltaPerUnit: delta,
      unitPrice,
      total
    };
  },

  _recalc() {
    if (!this.product) return;
    const calc = this._calcPrice();
    document.getElementById("pv-total").textContent = calc.total.toFixed(2);
  },

  _showError() {
    const el = document.getElementById("pv-error");
    if (el) el.classList.remove("d-none");
  },

  _hideError() {
    const el = document.getElementById("pv-error");
    if (el) el.classList.add("d-none");
  }
};
