Kiosk.pages.menu = function () {
  // Render base menu layout
  Kiosk.ui.render("tpl-menu");

  // Render sections inside menu
  Kiosk.ui.renderInto("tpl-category", "#slot-category");
  Kiosk.ui.renderInto("tpl-sub-category", "#slot-sub-category");
  Kiosk.ui.renderInto("tpl-product", "#slot-product");
  Kiosk.ui.renderInto("tpl-checkout-footer", "#slot-checkout-footer");
  Kiosk.ui.renderInto("tpl-product-variant", "#slot-variant");

  // Init logic modules
  Kiosk.category.init();
  Kiosk.subCategory.init();
  Kiosk.product.init();

  // IMPORTANT: init cart after footer exists
  Kiosk.cart.init();
};
