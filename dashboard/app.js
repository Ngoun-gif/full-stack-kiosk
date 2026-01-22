// dashboard/app.js
const { createApp } = Vue;

function tpl(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.error("Template not found:", id);
    return "";
  }
  return el.innerHTML;
}

(function bootstrapDashboard() {
  const headerTpl  = tpl("tpl-layout-header");
  const sidebarTpl = tpl("tpl-layout-sidebar");
  const masterTpl  = tpl("tpl-layout-master");
  const footerTpl  = tpl("tpl-layout-footer");

  const categoryTpl    = tpl("tpl-category");
  const subCategoryTpl = tpl("tpl-sub_category");
  const productTpl     = tpl("tpl-product");
  const variantTpl     = tpl("tpl-variant");

  const rootTemplate = `
    <div class="d-flex flex-column" style="min-height:100vh;">
      ${headerTpl}

      <div class="container-fluid flex-grow-1">
        <div class="row">
          <div class="col-12 col-lg-2 p-0">
            ${sidebarTpl}
          </div>
          <div class="col-12 col-lg-10 p-0 bg-light">
            ${masterTpl}
          </div>
        </div>
      </div>

      ${footerTpl}
    </div>
  `;

  createApp({
    template: rootTemplate,
    data() {
      return {
        router: Dashboard.router,
        views: {
          category:     { template: categoryTpl },
          sub_category: { template: subCategoryTpl },
          product:      { template: productTpl },
          variant:      { template: variantTpl },
        }
      };
    },
    computed: {
      currentView() {
        return this.views[this.router.state.route] || this.views.category;
      }
    },
    methods: {
      refresh() { this.router.setFooter("Refreshed ✅"); },
      logout()  { this.router.setFooter("Logout (TODO)"); }
    }
  }).mount("#adminApp");
})();
