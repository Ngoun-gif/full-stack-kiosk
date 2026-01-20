window.Kiosk = window.Kiosk || {};

Kiosk.ui = {
  render(templateId) {
    const tpl = document.getElementById(templateId);
    if (!tpl) {
      console.error("Template not found:", templateId);
      return;
    }
    const app = document.getElementById("app");
    if (!app) {
      console.error("#app not found");
      return;
    }
    app.innerHTML = tpl.innerHTML;
  }
};
