# backend/controllers/product_variant_controller.py (FULL with delete)
import sqlite3
from backend.repositories.product_variant_repository import ProductVariantRepository

class ProductVariantController:
    def __init__(self):
        self.repo = ProductVariantRepository()

    def list_by_product(self, product_id: int, include_inactive=True):
        return {"status": "ok", "data": self.repo.list_by_product(int(product_id), bool(include_inactive))}

    def get(self, variant_id: int):
        v = self.repo.get(int(variant_id))
        if not v:
            return {"status": "error", "message": "Variant not found"}
        return {"status": "ok", "data": v}

    def create(self, payload: dict):
        if not payload.get("product_id"):
            return {"status": "error", "message": "product_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        try:
            payload["price_delta"] = float(payload.get("price_delta", 0))
        except Exception:
            return {"status": "error", "message": "price_delta must be a number"}

        try:
            new_id = self.repo.create(payload)
            return {"status": "ok", "id": new_id}
        except sqlite3.IntegrityError:
            return {"status": "error", "message": "Duplicate variant name for this product OR SKU already exists"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def update(self, variant_id: int, payload: dict):
        if not payload.get("product_id"):
            return {"status": "error", "message": "product_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        try:
            payload["price_delta"] = float(payload.get("price_delta", 0))
        except Exception:
            return {"status": "error", "message": "price_delta must be a number"}

        try:
            self.repo.update(int(variant_id), payload)
            return {"status": "ok"}
        except sqlite3.IntegrityError:
            return {"status": "error", "message": "Duplicate variant name for this product OR SKU already exists"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def toggle(self, variant_id: int, is_active: int):
        try:
            self.repo.toggle(int(variant_id), int(is_active))
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def delete(self, variant_id: int):
        try:
            self.repo.delete(int(variant_id))
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
