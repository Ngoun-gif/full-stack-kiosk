window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

console.log("router.js loaded");

Kiosk.router = {
  start() {
    console.log("router.start()");
    this.go("splash"); // or "menu" for testing
  },
  go(name) {
    console.log("router.go()", name);
    const fn = Kiosk.pages[name];
    if (!fn) {
      console.error("Route not found:", name, "Available:", Object.keys(Kiosk.pages));
      return;
    }
    fn();
  }
};
