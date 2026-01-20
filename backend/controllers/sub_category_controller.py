import sqlite3
from backend.repositories.sub_category_repository import SubCategoryRepository

class SubCategoryController:
    def __init__(self):
        self.repo = SubCategoryRepository()

    def list_by_category(self, category_id: int, include_inactive=True):
        return {"status": "ok", "data": self.repo.list_by_category(int(category_id), bool(include_inactive))}

    def get(self, sub_category_id: int):
        sc = self.repo.get(int(sub_category_id))
        if not sc:
            return {"status": "error", "message": "Sub-category not found"}
        return {"status": "ok", "data": sc}

    def create(self, payload: dict):
        if not payload.get("category_id"):
            return {"status": "error", "message": "category_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        try:
            new_id = self.repo.create(payload)
            return {"status": "ok", "id": new_id}
        except sqlite3.IntegrityError:
            # handles unique constraint uq_sub_categories_cat_name
            return {"status": "error", "message": "Sub-category name already exists in this category"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def update(self, sub_category_id: int, payload: dict):
        if not payload.get("category_id"):
            return {"status": "error", "message": "category_id is required"}
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}

        try:
            self.repo.update(int(sub_category_id), payload)
            return {"status": "ok"}
        except sqlite3.IntegrityError:
            return {"status": "error", "message": "Sub-category name already exists in this category"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def toggle(self, sub_category_id: int, is_active: int):
        try:
            self.repo.toggle(int(sub_category_id), int(is_active))
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
