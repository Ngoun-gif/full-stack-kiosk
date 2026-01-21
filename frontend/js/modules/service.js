window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.service = function () {
  Kiosk.ui.render("tpl-service");

  Kiosk.state = Kiosk.state || {};
  if (!Kiosk.state.service) Kiosk.state.service = "dine_in";

  window.goSplash = () => Kiosk.router.go("splash");

  window.selectService = (mode) => {
    Kiosk.state.service = mode;

    const dine = document.getElementById("dineInOption");
    const take = document.getElementById("takeAwayOption");

    if (dine) dine.classList.toggle("selected", mode === "dine_in");
    if (take) take.classList.toggle("selected", mode === "takeaway");
  };

  window.continueService = () => {
    // go to next screen
    Kiosk.router.go("menu");
  };

  // If you want "tap card = go menu immediately", uncomment:
  // window.selectService = (mode) => { ...; Kiosk.router.go("menu"); };

  // apply selection on load
  window.selectService(Kiosk.state.service);
};
