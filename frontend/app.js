function startApp() {
  const app = document.getElementById("app");
  if (app) app.innerHTML = "<div style='padding:16px;font-size:20px'>Starting...</div>";

  console.log("startApp fired");
  console.log("Kiosk exists?", !!window.Kiosk);
  console.log("router exists?", !!(window.Kiosk && Kiosk.router));

  if (!window.Kiosk || !Kiosk.router) {
    console.error("Kiosk.router missing");
    return;
  }

  if (Kiosk.api && Kiosk.api.init) Kiosk.api.init();

  console.log("calling router.start()");
  Kiosk.router.start();
}

window.addEventListener("DOMContentLoaded", () => setTimeout(startApp, 0));
window.addEventListener("pywebviewready", () => setTimeout(startApp, 0));
