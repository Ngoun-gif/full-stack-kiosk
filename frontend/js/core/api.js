window.Kiosk = window.Kiosk || {};

Kiosk.api = {
  init() {
    Kiosk._api = window.pywebview?.api || null;
  }
};
