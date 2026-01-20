window.Kiosk = window.Kiosk || {};
Kiosk.pages = Kiosk.pages || {};

Kiosk.pages.splash = function () {
  Kiosk.ui.render("tpl-splash");

  window.goServiceFromSplash = () => {
    Kiosk.router.go("service");
  };

  const el = document.getElementById("splashCarousel");
  if (el && window.bootstrap && bootstrap.Carousel) {
    const old = bootstrap.Carousel.getInstance(el);
    if (old) old.dispose();

    new bootstrap.Carousel(el, {
      interval: 2500,
      ride: "carousel",
      pause: false,
      touch: false,
      wrap: true
    });
  }
};
