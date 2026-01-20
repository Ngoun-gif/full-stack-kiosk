window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.menu = function () {
  Kiosk.ui.render("tpl-menu");

  window.goService = () => Kiosk.router.go("service");

  const grid = document.getElementById("productGrid");
  if (grid) {
    grid.innerHTML = `
      <div class="text-muted">
        Menu loaded. Service mode: <b>${Kiosk.state.service || "-"}</b>
      </div>
    `;
  }
};
