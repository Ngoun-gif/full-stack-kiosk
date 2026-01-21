window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.checkout = function () {
  Kiosk.ui.render("tpl-checkout-page");
  Kiosk.checkout.render();
};

Kiosk.checkout = {
  render() {
    const items = Kiosk.state.cart.items;

    const list = document.getElementById("checkout-list");
    const empty = document.getElementById("checkout-empty");
    const btnPay = document.getElementById("btn-pay");

    if (!list || !empty || !btnPay) return;

    // update totals
    Kiosk.cart.recalc();

    // footer summary
    const cc = document.getElementById("co-count");
    const ct = document.getElementById("co-total");
    if (cc) cc.textContent = String(Kiosk.state.cart.count);
    if (ct) ct.textContent = Number(Kiosk.state.cart.total).toFixed(2);

    btnPay.disabled = items.length === 0;

    if (items.length === 0) {
      empty.classList.remove("d-none");
      list.innerHTML = "";
      return;
    }

    empty.classList.add("d-none");

    list.innerHTML = items.map((it, idx) => `
      <div class="card border-0 shadow-sm">
        <div class="card-body">

          <div class="d-flex justify-content-between align-items-start gap-3">

            <!-- LEFT: image + details -->
            <div class="d-flex gap-3 flex-grow-1">

              <div class="bg-light border rounded-3 d-flex align-items-center justify-content-center"
                   style="width:84px; height:84px; overflow:hidden;">
                ${it.image
                  ? `<img src="${it.image}" alt="${it.name}" style="width:100%; height:100%; object-fit:cover;">`
                  : `<span class="text-muted small">No image</span>`
                }
              </div>

              <div class="flex-grow-1">
                <div class="fw-bold">${it.name}</div>
                <div class="text-muted small">${this.formatOptions(it.selections)}</div>

                <div class="btn-group mt-2" role="group" aria-label="quantity">
                  <button class="btn btn-light border" type="button"
                          onclick="Kiosk.checkout.decQty(${idx})">−</button>
                  <button class="btn btn-white border fw-semibold" type="button" disabled>
                    ${it.qty}
                  </button>
                  <button class="btn btn-light border" type="button"
                          onclick="Kiosk.checkout.incQty(${idx})">+</button>
                </div>
              </div>

            </div>

            <!-- RIGHT: price -->
            <div class="text-end" style="min-width:90px;">
              <div class="fw-bold text-warning">$${Number(it.lineTotal).toFixed(2)}</div>
              <button class="btn btn-link text-danger text-decoration-none p-0 mt-2"
                      type="button"
                      onclick="Kiosk.checkout.removeItem(${idx})">
                Remove
              </button>
            </div>

          </div>

        </div>
      </div>
    `).join("");
  },

  incQty(i) {
    const it = Kiosk.state.cart.items[i];
    if (!it) return;

    it.qty += 1;
    it.lineTotal = Number(it.unitPrice) * Number(it.qty);

    Kiosk.cart.recalc();
    this.render();
  },

  decQty(i) {
    const it = Kiosk.state.cart.items[i];
    if (!it || it.qty <= 1) return;

    it.qty -= 1;
    it.lineTotal = Number(it.unitPrice) * Number(it.qty);

    Kiosk.cart.recalc();
    this.render();
  },

  removeItem(i) {
    Kiosk.state.cart.items.splice(i, 1);
    Kiosk.cart.recalc();
    this.render();
  },

  // Better option label output (Type/Sugar/Size)
  formatOptions(selections) {
    if (!selections) return "";

    const parts = [];
    for (const group of (Kiosk.data.variantGroups || [])) {
      const chosenId = selections[group.key];
      if (!chosenId) continue;

      const opt = group.options.find(o => o.id === chosenId);
      const label = opt ? opt.label : chosenId;

      parts.push(`${group.title}: ${label}`);
    }
    return parts.join(" | ");
  }
};
