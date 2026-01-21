window.Kiosk = window.Kiosk || {};

Kiosk.product = {
  init() {
    this.render();

    const slot = document.getElementById("slot-product");
    if (!slot) return;

    slot.addEventListener("click", (e) => {
      const card = e.target.closest("[data-product-id]");
      if (!card) return;

      const id = Number(card.dataset.productId);
      const p = Kiosk.data.products.find(x => x.id === id);
      if (p) Kiosk.variant.open(p);
    });
  },

  render() {
    const container = document.getElementById("product-items");
    if (!container) return;

    const { categoryId, subCategoryId } = Kiosk.state.catalog;

    const items = Kiosk.data.products.filter(p => {
      if (p.categoryId !== categoryId) return false;
      if (subCategoryId === null) return true;
      if (subCategoryId === "all") return true;
      return p.subCategoryId === subCategoryId;
    });

    container.innerHTML = `
      <div class="container py-4" style="background:#fffef0;">
        <div class="row g-4">
          ${items.map(p => `
            <div class="col-12 col-sm-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100" role="button" data-product-id="${p.id}">
                <div class="p-3">
                  <div class="bg-light rounded-4 border d-flex justify-content-center align-items-center" style="height:220px;">
                    <img src="${p.image}" alt="${p.name}" style="max-height:200px; max-width:100%;">
                  </div>
                </div>
                <div class="card-body text-center">
                  <div class="fw-bold">${p.name}</div>
                  <div class="fw-bold text-warning">$ ${Number(p.price).toFixed(2)}</div>
                </div>
              </div>
            </div>
          `).join("")}

          ${items.length === 0 ? `
            <div class="col-12">
              <div class="text-center text-muted py-5">No products.</div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }
};
