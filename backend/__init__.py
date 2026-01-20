from backend.controllers.category_controller import CategoryController
from backend.controllers.sub_category_controller import SubCategoryController
from backend.controllers.product_controller import ProductController
from backend.controllers.product_variant_controller import ProductVariantController

class AppApi:
    def __init__(self):
        self.category = CategoryController()
        self.sub_category = SubCategoryController()
        self.product = ProductController()
        self.product_variant = ProductVariantController()
