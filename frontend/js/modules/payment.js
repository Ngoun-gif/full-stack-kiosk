window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.payment_qr = function () {
  Kiosk.ui.render("tpl-payment-qr");
  Kiosk.payment.initQr();
};

Kiosk.pages.pay_counter = function () {
  Kiosk.ui.render("tpl-pay-counter");
  Kiosk.payment.initCounter();
};

// optional alias
Kiosk.pages.payment = function () {
  Kiosk.router.go("payment_method");
};

Kiosk.payment = {
  initQr() {
    if (!Kiosk.state.cart.items.length) {
      Kiosk.router.go("menu");
      return;
    }

    Kiosk.cart.recalc();

    const amt = document.getElementById("payAmount");
    if (amt) amt.textContent = Number(Kiosk.state.cart.total).toFixed(2);

    // default bank
    this.setQrBank("aba");
  },

  setQrBank(bank) {
    const img = document.getElementById("qrImage");
    if (!img) return;

    // ✅ your requested path
    if (bank === "aba") img.src = "./assets/payment/aba_khim.png";
  },

  completeQr() {
    this.finishAndClear();
  },

  initCounter() {
    if (!Kiosk.state.cart.items.length) {
      Kiosk.router.go("menu");
      return;
    }

    Kiosk.cart.recalc();

    const amt = document.getElementById("counterAmount");
    if (amt) amt.textContent = Number(Kiosk.state.cart.total).toFixed(2);
  },

  printCounterReceipt() {
    console.log("Print receipt requested", {
      items: Kiosk.state.cart.items,
      total: Kiosk.state.cart.total
    });
    alert("Print receipt (demo). Connect to backend later.");
  },

  finishAndClear() {
    Kiosk.state.cart.items = [];
    Kiosk.cart.recalc();
    Kiosk.router.go("menu");
  }
};
