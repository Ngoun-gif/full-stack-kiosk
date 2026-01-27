# backend/app_api.py
from backend.controllers.category_controller import CategoryController
from backend.controllers.sub_category_controller import SubCategoryController
from backend.controllers.product_controller import ProductController
from backend.controllers.variant_group_controller import VariantGroupController
from backend.controllers.variant_value_controller import VariantValueController
from backend.controllers.kiosk_menu_controller import KioskMenuController


class AppApi:
    """
    PyWebView JS API:
    window.pywebview.api.<method>(...)
    """

    def __init__(self):
        # ✅ wire controllers ONCE
        self.category = CategoryController()
        self.sub_category = SubCategoryController()
        self.product = ProductController()
        self.variant_group = VariantGroupController()
        self.variant_value = VariantValueController()
        self.kiosk_menu = KioskMenuController()


    # =========================
    # Dashboard CRUD: Category
    # =========================
    def category_list(self, include_inactive=True):
        return self.category.list(bool(include_inactive))

    def category_create(self, payload):
        return self.category.create(payload or {})

    def category_update(self, category_id, payload):
        return self.category.update(int(category_id), payload or {})

    def category_toggle(self, category_id, is_active):
        return self.category.toggle(int(category_id), int(is_active))

    def category_delete(self, category_id):
        return self.category.delete(int(category_id))

    # =========================
    # Dashboard CRUD: Sub-Category
    # =========================
    def sub_category_list(self, category_id, include_inactive=True):
        return self.sub_category.list_by_category(int(category_id), bool(include_inactive))

    def sub_category_get(self, sub_category_id):
        return self.sub_category.get(int(sub_category_id))

    def sub_category_create(self, payload):
        return self.sub_category.create(payload or {})

    def sub_category_update(self, sub_category_id, payload):
        return self.sub_category.update(int(sub_category_id), payload or {})

    def sub_category_toggle(self, sub_category_id, is_active):
        return self.sub_category.toggle(int(sub_category_id), int(is_active))

    def sub_category_delete(self, sub_category_id):
        # if you have controller.delete; if not, remove this
        return self.sub_category.delete(int(sub_category_id))

    # =========================
    # Dashboard CRUD: Product
    # =========================
    def product_list(self, sub_category_id, include_inactive=True):
        return self.product.list_by_sub_category(int(sub_category_id), bool(include_inactive))

    def product_get(self, product_id):
        return self.product.get(int(product_id))

    def product_create(self, payload):
        return self.product.create(payload or {})

    def product_update(self, product_id, payload):
        return self.product.update(int(product_id), payload or {})

    def product_toggle(self, product_id, is_active):
        return self.product.toggle(int(product_id), int(is_active))

    def product_delete(self, product_id):
        # if you have controller.delete; if not, remove this
        return self.product.delete(int(product_id))

    # Variant Groups
    def variant_group_list(self, product_id, include_inactive=True):
        return self.variant_group.list_by_product(int(product_id), bool(include_inactive))

    def variant_group_create(self, payload):
        return self.variant_group.create(payload or {})

    def variant_group_update(self, group_id, payload):
        return self.variant_group.update(int(group_id), payload or {})

    def variant_group_toggle(self, group_id, is_active):
        return self.variant_group.toggle(int(group_id), int(is_active))

    def variant_group_delete(self, group_id):
        return self.variant_group.delete(int(group_id))

    def variant_groups_with_values(self, product_id, include_inactive=True):
        return self.variant_group.list_groups_with_values(int(product_id), bool(include_inactive))

    # Variant Values
    def variant_value_list(self, group_id, include_inactive=True):
        return self.variant_value.list_by_group(int(group_id), bool(include_inactive))

    def variant_value_create(self, payload):
        return self.variant_value.create(payload or {})

    def variant_value_update(self, value_id, payload):
        return self.variant_value.update(int(value_id), payload or {})

    def variant_value_toggle(self, value_id, is_active):
        return self.variant_value.toggle(int(value_id), int(is_active))

    def variant_value_delete(self, value_id):
        return self.variant_value.delete(int(value_id))

    # Kiosk: load all menu upfront
    def kiosk_menu_all(self):
        return self.kiosk_menu.load_all()


