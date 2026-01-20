window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.service = function () {
  Kiosk.ui.render("tpl-service");

  window.chooseService = (mode) => {
    Kiosk.state.service = mode;
    Kiosk.router.go("menu");
  };
};
