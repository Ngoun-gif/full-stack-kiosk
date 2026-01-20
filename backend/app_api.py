
class AppApi:

    # Dashboard CRUD: Category
    def category_list(self, include_inactive=True):
        return self.category.list(include_inactive)

    def category_create(self, payload):
        return self.category.create(payload)

    def category_update(self, category_id, payload):
        return self.category.update(category_id, payload)

    def category_toggle(self, category_id, is_active):
        return self.category.toggle(category_id, is_active)

    # Dashboard CRUD: Sub-Category
    def sub_category_list(self, category_id, include_inactive=True):
        return self.sub_category.list_by_category(int(category_id), include_inactive)

    def sub_category_get(self, sub_category_id):
        return self.sub_category.get(int(sub_category_id))

    def sub_category_create(self, payload):
        return self.sub_category.create(payload)

    def sub_category_update(self, sub_category_id, payload):
        return self.sub_category.update(int(sub_category_id), payload)

    def sub_category_toggle(self, sub_category_id, is_active):
        return self.sub_category.toggle(int(sub_category_id), int(is_active))


    # Dashboard CRUD: Product
    def product_list(self, sub_category_id, include_inactive=True):
        return self.product.list_by_sub_category(int(sub_category_id), include_inactive)

    def product_get(self, product_id):
        return self.product.get(int(product_id))

    def product_create(self, payload):
        return self.product.create(payload)

    def product_update(self, product_id, payload):
        return self.product.update(int(product_id), payload)

    def product_toggle(self, product_id, is_active):
        return self.product.toggle(int(product_id), int(is_active))


    # Dashboard CRUD: Product Variant
    def variant_list(self, product_id, include_inactive=True):
        return self.variant.list_by_product(int(product_id), include_inactive)

    def variant_get(self, variant_id):
        return self.variant.get(int(variant_id))

    def variant_create(self, payload):
        return self.variant.create(payload)

    def variant_update(self, variant_id, payload):
        return self.variant.update(int(variant_id), payload)

    def variant_toggle(self, variant_id, is_active):
        return self.variant.toggle(int(variant_id), int(is_active))



