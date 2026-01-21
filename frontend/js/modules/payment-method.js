window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.payment_method = function () {
  Kiosk.ui.render("tpl-payment-method");
  Kiosk.paymentMethod.init();
};

Kiosk.paymentMethod = {
  selected: "counter", // default

  init() {
    // if cart empty, go back
    if (!Kiosk.state.cart.items.length) {
      Kiosk.router.go("menu");
      return;
    }

    // update total in footer
    Kiosk.cart.recalc();
    const totalEl = document.getElementById("pm-total");
    if (totalEl) totalEl.textContent = Number(Kiosk.state.cart.total).toFixed(2);

    // apply selected UI
    this.applySelectedUI();
  },

  select(method) {
    this.selected = method; // 'counter' | 'qrcode'
    this.applySelectedUI();
  },

  applySelectedUI() {
    const counter = document.getElementById("payCounterOption");
    const qr = document.getElementById("payQRCodeOption");
    if (!counter || !qr) return;

    // your CSS uses .selected class
    counter.classList.toggle("selected", this.selected === "counter");
    qr.classList.toggle("selected", this.selected === "qrcode");
  },

  continue() {
    if (this.selected === "qrcode") {
      Kiosk.router.go("payment_qr");
    } else {
      Kiosk.router.go("pay_counter");
    }
  }
};
