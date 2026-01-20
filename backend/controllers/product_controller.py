import sqlite3
from backend.repositories.product_repository import ProductRepository

class ProductController:
    def __init__(self):
        self.repo = ProductRepository()

    def list_by_sub_category(self, sub_category_id: int, include_inactive=True):
        return {"status": "ok", "data": self.repo.list_by_sub_category(int(sub_category_id), bool(include_inactive))}

    def get(self, product_id: int):
        p = self.repo.get(int(product_id))
        if not p:
            return {"status": "error", "message": "Product not found"}
        return {"status": "ok", "data": p}

    def create(self, payload: dict):
        if not payload.get("sub_category_id"):
            return {"status": "error", "message": "sub_category_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        # allow 0 price, but ensure it's numeric
        try:
            payload["base_price"] = float(payload.get("base_price", 0))
        except Exception:
            return {"status": "error", "message": "base_price must be a number"}

        try:
            new_id = self.repo.create(payload)
            return {"status": "ok", "id": new_id}
        except sqlite3.IntegrityError:
            # SKU unique constraint or other constraint
            return {"status": "error", "message": "SKU already exists (must be unique)"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def update(self, product_id: int, payload: dict):
        if not payload.get("sub_category_id"):
            return {"status": "error", "message": "sub_category_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        try:
            payload["base_price"] = float(payload.get("base_price", 0))
        except Exception:
            return {"status": "error", "message": "base_price must be a number"}

        try:
            self.repo.update(int(product_id), payload)
            return {"status": "ok"}
        except sqlite3.IntegrityError:
            return {"status": "error", "message": "SKU already exists (must be unique)"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def toggle(self, product_id: int, is_active: int):
        try:
            self.repo.toggle(int(product_id), int(is_active))
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
