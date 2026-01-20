from backend.repositories.category_repository import CategoryRepository

class CategoryController:
    def __init__(self):
        self.repo = CategoryRepository()

    def list(self, include_inactive=True):
        return {"status": "ok", "data": self.repo.list(bool(include_inactive))}

    def create(self, payload: dict):
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}
        try:
            new_id = self.repo.create(payload)
            return {"status": "ok", "id": new_id}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def update(self, category_id: int, payload: dict):
        if not payload.get("name"):
            return {"status": "error", "message": "name is required"}
        try:
            self.repo.update(int(category_id), payload)
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def toggle(self, category_id: int, is_active: int):
        try:
            self.repo.toggle(int(category_id), int(is_active))
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
