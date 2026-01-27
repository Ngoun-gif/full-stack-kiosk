// kiosk_main/js/core/router.js
window.Kiosk = window.Kiosk || {};

Kiosk.router = {
  state: Vue.reactive({
    route: "splash",
    footerMsg: "Ready",

    // kiosk states
    service: null,
    categoryId: 0,
    subCategoryId: 0,
    cart: []
  }),

  go(name) {
    this.state.route = name;
    this.state.footerMsg = `Open: ${name}`;
  },

  setFooter(msg) {
    this.state.footerMsg = msg;
  }
};
