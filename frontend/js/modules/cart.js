// frontend/js/modules/cart.js
window.Kiosk = window.Kiosk || {};
Kiosk.modules = Kiosk.modules || {};

Kiosk.modules["cart"] = {
  template: tpl("tpl-cart"),

  data() {
    return {
      router: Kiosk.router
    };
  },

  computed: {
    lines() {
      return (this.router.state.cart || []).filter(Boolean);
    },

    total() {
      const cart = this.router.state.cart || [];
      return cart.reduce((sum, i) => sum + Number(i?.line_total || 0), 0);
    },

    count() {
      const cart = this.router.state.cart || [];
      return cart.reduce((s, i) => s + Number(i?.qty || 1), 0);
    }
  },

  methods: {
    // same image mapping as menu / product-variant
    img(p) {
      if (!p) return "./assets/placeholder.png";

      const clean = String(p).replace(/^\/+/, "");

      if (clean.startsWith("assets/uploads/")) return "../dashboard/" + clean;
      if (clean.startsWith("dashboard/")) return "../" + clean;
      if (clean.startsWith("assets/")) return "../" + clean;

      return "./" + clean;
    },

    goMenu() {
      this.router.go("menu");
    },

    // qty adjust directly in cart
    incQty(index) {
      const cart = this.router.state.cart || [];
      const line = cart[index];
      if (!line) return;

      line.qty = Math.min(99, Number(line.qty || 1) + 1);

      // recalc line_total based on unit price
      const unit = Number(line.line_total || 0) / Math.max(1, Number(line.qty || 1) - 1 || 1);
      // safer: recompute using base + extras
      const base = Number(line.base_price || 0);
      const extras = (line.variants || []).reduce((s, v) => s + Number(v.extra_price || 0), 0);
      line.line_total = (base + extras) * Number(line.qty || 1);

      this.router.state.cart = cart;
    },

    decQty(index) {
      const cart = this.router.state.cart || [];
      const line = cart[index];
      if (!line) return;

      line.qty = Math.max(1, Number(line.qty || 1) - 1);

      const base = Number(line.base_price || 0);
      const extras = (line.variants || []).reduce((s, v) => s + Number(v.extra_price || 0), 0);
      line.line_total = (base + extras) * Number(line.qty || 1);

      this.router.state.cart = cart;
    },

    removeItem(index) {
      const cart = this.router.state.cart || [];
      if (index < 0 || index >= cart.length) return;

      cart.splice(index, 1);
      this.router.state.cart = cart;
      this.router.setFooter("Removed ✅");
    },

    editItem(index) {
      const cart = this.router.state.cart || [];
      const line = cart[index];
      if (!line) return;

      // open product-variant in edit mode
      this.router.state.productId = Number(line.product_id);
      this.router.state.editCartIndex = index;
      this.router.go("product-variant");
    },

    confirmOrder() {
      if (this.count === 0) return;
      this.router.go("checkout");
    }
  }
};
