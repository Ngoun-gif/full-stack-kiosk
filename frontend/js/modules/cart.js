window.Kiosk = window.Kiosk || {};

Kiosk.cart = {
  init() {
    this.recalc();
  },

  recalc() {
    let count = 0;
    let total = 0;

    for (const it of Kiosk.state.cart.items) {
      count += Number(it.qty || 0);
      total += Number(it.lineTotal || 0);
    }

    Kiosk.state.cart.count = count;
    Kiosk.state.cart.total = total;

    this.render();
  },

  render() {
    const c = document.getElementById("cart-count");
    const t = document.getElementById("cart-total");

    if (c) c.textContent = String(Kiosk.state.cart.count);
    if (t) t.textContent = Number(Kiosk.state.cart.total).toFixed(2);
  }
};
