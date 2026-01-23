// dashboard/js/module/variant.js
window.Dashboard = window.Dashboard || {};
Dashboard.modules = Dashboard.modules || {};

Dashboard.modules.variant = {
  template: tpl("tpl-variant"),

  data() {
    return {
      categories: [],
      subCategories: [],
      products: [],

      categoryId: 0,
      subCategoryId: 0,
      productId: 0,

      rows: [],
      includeInactive: true,
      q: "",

      isEdit: false,
      saving: false,
      errorMsg: "",

      form: {
        id: null,
        name: "",
        sku: "",
        price_delta: 0,
        sort_order: 0,
        is_active: true,
      },
    };
  },

  computed: {
    filtered() {
      const q = (this.q || "").toLowerCase().trim();
      if (!q) return this.rows;
      return this.rows.filter(r =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.sku || "").toLowerCase().includes(q)
      );
    }
  },

  mounted() {
    if (window.pywebview?.api) this.init();
    else window.addEventListener("pywebviewready", () => this.init(), { once: true });
  },

  methods: {
    formatDelta(v) {
      const n = Number(v || 0);
      const s = n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return (n > 0 ? "+" : "") + s;
    },

    async init() {
      await this.loadCategories();
      if (this.categories.length && !this.categoryId) {
        this.categoryId = this.categories[0].id;
      }
      await this.onChangeCategory();
    },

    async loadCategories() {
      const res = await Api.call("category_list", true);
      this.categories = (res?.status === "ok" ? (res.data || []) : []);
    },

    async onChangeCategory() {
      this.subCategories = [];
      this.products = [];
      this.rows = [];
      this.subCategoryId = 0;
      this.productId = 0;

      if (!this.categoryId) return;

      const res = await Api.call("sub_category_list", this.categoryId, true);
      this.subCategories = (res?.status === "ok" ? (res.data || []) : []);

      if (this.subCategories.length) {
        this.subCategoryId = this.subCategories[0].id;
        await this.onChangeSubCategory();
      }
    },

    async onChangeSubCategory() {
      this.products = [];
      this.rows = [];
      this.productId = 0;

      if (!this.subCategoryId) return;

      const res = await Api.call("product_list", this.subCategoryId, true);
      this.products = (res?.status === "ok" ? (res.data || []) : []);

      if (this.products.length) {
        this.productId = this.products[0].id;
        await this.load();
      }
    },

    async load() {
      try {
        if (!this.productId) {
          this.rows = [];
          return;
        }

        Dashboard.router.setFooter("Loading variants...");
        const res = await Api.call("variant_list", this.productId, this.includeInactive);
        if (res?.status !== "ok") throw new Error(res?.message || "Load failed");

        this.rows = res.data || [];
        Dashboard.router.setFooter(`Loaded: ${this.rows.length}`);
      } catch (e) {
        console.error(e);
        Dashboard.router.setFooter("Load failed ❌");
      }
    },

    openCreate() {
      this.isEdit = false;
      this.errorMsg = "";
      this.saving = false;

      this.form = { id: null, name: "", sku: "", price_delta: 0, sort_order: 0, is_active: true };
      $("#varModal").modal("show");
    },

    openEdit(v) {
      this.isEdit = true;
      this.errorMsg = "";
      this.saving = false;

      this.form = {
        id: v.id,
        name: v.name || "",
        sku: v.sku || "",
        price_delta: Number(v.price_delta || 0),
        sort_order: Number(v.sort_order || 0),
        is_active: !!v.is_active
      };

      $("#varModal").modal("show");
    },

    async save() {
      this.errorMsg = "";

      if (!this.productId) {
        this.errorMsg = "Please select a product first.";
        return;
      }
      if (!this.form.name || !this.form.name.trim()) {
        this.errorMsg = "Variant name is required.";
        return;
      }

      this.saving = true;
      try {
        const payload = {
          product_id: Number(this.productId),
          name: this.form.name.trim(),
          sku: (this.form.sku || "").trim() || null,
          price_delta: Number(this.form.price_delta || 0),
          sort_order: Number(this.form.sort_order || 0),
          is_active: this.form.is_active ? 1 : 0
        };

        let res;
        if (this.isEdit) res = await Api.call("variant_update", this.form.id, payload);
        else res = await Api.call("variant_create", payload);

        if (res?.status !== "ok") throw new Error(res?.message || "Save failed");

        $("#varModal").modal("hide");
        await this.load();
        Dashboard.router.setFooter("Saved ✅");
      } catch (e) {
        console.error(e);
        this.errorMsg = e.message || "Save failed";
      } finally {
        this.saving = false;
      }
    },

    async toggle(v) {
      try {
        const next = v.is_active ? 0 : 1;
        const res = await Api.call("variant_toggle", v.id, next);
        if (res?.status !== "ok") throw new Error(res?.message || "Toggle failed");
        await this.load();
      } catch (e) {
        console.error(e);
        alert(e.message || "Toggle failed");
      }
    },

    async remove(v) {
      if (!confirm(`Delete variant "${v.name}"?`)) return;

      try {
        const res = await Api.call("variant_delete", v.id);
        if (res?.status !== "ok") throw new Error(res?.message || "Delete failed");
        await this.load();
      } catch (e) {
        console.error(e);
        alert(e.message || "Delete failed");
      }
    }
  }
};
