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
  },

  // ✅ NEW
  renderInto(templateId, containerSelector) {
    const tpl = document.getElementById(templateId);
    if (!tpl) {
      console.error("Template not found:", templateId);
      return;
    }
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error("Container not found:", containerSelector);
      return;
    }
    container.innerHTML = tpl.innerHTML;
  }
};
