// frontend/js/modules/product-variant.js
window.Kiosk = window.Kiosk || {};
Kiosk.modules = Kiosk.modules || {};

Kiosk.modules["product-variant"] = {
  template: tpl("tpl-product-variant"),

  data() {
    return {
      router: Kiosk.router,
      product: null,
      groups: [],
      valuesByGroup: {},
      selections: {},
      qty: 1,

      // force UI refresh in kiosk/webview
      renderTick: 0,

      // ✅ edit mode
      editIndex: null
    };
  },

  computed: {
    lineTotal() {
      const base = Number(this.product?.base_price || 0);
      let extra = 0;

      for (const gid in this.selections) {
        const picked = this.selections[gid] || [];
        const vals = this.valuesByGroup[gid] || [];
        picked.forEach(vid => {
          const v = vals.find(x => Number(x.id) === Number(vid));
          extra += Number(v?.extra_price || 0);
        });
      }

      return (base + extra) * Number(this.qty || 1);
    }
  },

  mounted() {
    const pid = Number(this.router.state.productId || 0);
    const menuAll = this.router.state.menuAll;

    if (!pid || !menuAll) {
      this.router.setFooter("Product not found");
      this.router.go("menu");
      return;
    }

    // ✅ read edit index passed from menu
    this.editIndex = (this.router.state.editCartIndex ?? null);

    // find product
    let found = null;
    for (const k in (menuAll.prod_by_sub || {})) {
      const p = (menuAll.prod_by_sub[k] || []).find(x => Number(x.id) === pid);
      if (p) { found = p; break; }
    }
    this.product = found;

    if (!this.product) {
      this.router.setFooter("Product not found");
      this.router.go("menu");
      return;
    }

    // groups + values
    this.groups = (menuAll.group_by_product?.[pid] || []).map(g => ({
      ...g,
      id: Number(g.id),
      max_select: Number(g.max_select || 1),
      is_required: Number(g.is_required || 0)
    }));

    // init selections + values
    const sel = {};
    const vbg = {};

    this.groups.forEach(g => {
      const gid = Number(g.id);
      sel[gid] = [];
      vbg[gid] = (menuAll.value_by_group?.[gid] || []).map(v => ({
        ...v,
        id: Number(v.id),
        extra_price: Number(v.extra_price || 0)
      }));
    });

    this.selections = sel;
    this.valuesByGroup = vbg;

    // ✅ EDIT MODE: preload from cart line
    if (this.editIndex !== null) {
      const cart = this.router.state.cart || [];
      const line = cart[this.editIndex];

      // make sure it matches the same product
      if (line && Number(line.product_id) === pid) {
        this.qty = Number(line.qty || 1);

        // rebuild selections from saved variants
        const sel2 = { ...this.selections };
        (line.variants || []).forEach(v => {
          const gid = Number(v.group_id);
          const vid = Number(v.value_id);
          const cur = sel2[gid] || [];
          if (!cur.includes(vid)) sel2[gid] = [...cur, vid];
        });
        this.selections = sel2;
      } else {
        // safety: if mismatch, treat as new
        this.editIndex = null;
        this.router.state.editCartIndex = null;
      }
    }

    this.renderTick++; // paint
  },

  methods: {
    img(x) {
      const p =
        (typeof x === "string") ? x :
        (x && typeof x === "object") ? (x.image_path || x.image || "") :
        "";

      if (!p) return "./assets/placeholder.png";
      const clean = String(p).replace(/^\/+/, "");
      if (clean.startsWith("assets/uploads/")) return "../dashboard/" + clean;
      if (clean.startsWith("dashboard/")) return "../" + clean;
      if (clean.startsWith("assets/")) return "../" + clean;
      return "./" + clean;
    },

    isSelected(gid, vid) {
      return (this.selections[Number(gid)] || []).includes(Number(vid));
    },

    toggleValue(group, value) {
      const gid = Number(group.id);
      const vid = Number(value.id);
      const max = Number(group.max_select || 1);

      const cur = this.selections[gid] || [];
      let nextArr;

      if (max === 1) {
        nextArr = [vid];
      } else {
        if (cur.includes(vid)) nextArr = cur.filter(x => x !== vid);
        else {
          if (cur.length >= max) return;
          nextArr = [...cur, vid];
        }
      }

      this.selections = { ...this.selections, [gid]: nextArr };

      // force UI refresh for kiosk/webview
      this.renderTick++;
      this.$forceUpdate?.();
    },

    incQty() {
      this.qty = Math.min(99, Number(this.qty || 1) + 1);
    },

    decQty() {
      this.qty = Math.max(1, Number(this.qty || 1) - 1);
    },

    validate() {
      for (const g of this.groups) {
        const picked = this.selections[Number(g.id)] || [];
        if (Number(g.is_required) === 1 && picked.length === 0) {
          return `Please select ${g.name}`;
        }
      }
      return "";
    },

    addToCart() {
      const msg = this.validate();
      if (msg) {
        this.router.setFooter(msg);
        return;
      }

      const cart = this.router.state.cart || [];

      const variants = this.groups.flatMap(g => {
        const gid = Number(g.id);
        const picked = this.selections[gid] || [];
        return picked.map(vid => {
          const v = (this.valuesByGroup[gid] || []).find(x => Number(x.id) === Number(vid));
          if (!v) return null;
          return {
            group_id: gid,
            group_name: g.name,
            value_id: Number(v.id),
            value_name: v.name,
            extra_price: Number(v.extra_price || 0)
          };
        }).filter(Boolean);
      });

      const line = {
        product_id: Number(this.product.id),
        name: this.product.name,
        image_path: this.product.image_path,   // ✅ add this
        base_price: Number(this.product.base_price || 0),
        qty: Number(this.qty || 1),
        variants,
        line_total: Number(this.lineTotal || 0)
      };

      // ✅ update existing line if edit mode
      const idx = (this.router.state.editCartIndex ?? null);
      if (idx !== null && cart[idx] && Number(cart[idx].product_id) === line.product_id) {
        cart[idx] = line;
        this.router.setFooter("Updated cart ✅");
      } else {
        cart.push(line);
        this.router.setFooter("Added to cart ✅");
      }

      this.router.state.cart = cart;

      // ✅ clear edit mode
      this.router.state.editCartIndex = null;
      this.editIndex = null;

      this.router.go("menu");
    },

    cancel() {
      // clear edit mode too
      this.router.state.editCartIndex = null;
      this.editIndex = null;
      this.router.go("menu");
    },

  }
};
