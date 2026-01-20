from backend.db import get_conn

class SubCategoryRepository:
    def list_by_category(self, category_id: int, include_inactive: bool = True):
        sql = """
          SELECT id, category_id, name, image_path, sort_order, is_active, created_at, updated_at
          FROM sub_categories
          WHERE category_id=?
        """
        params = [int(category_id)]
        if not include_inactive:
            sql += " AND is_active=1"
        sql += " ORDER BY sort_order ASC, id ASC"

        with get_conn() as conn:
            rows = conn.execute(sql, params).fetchall()
        return [dict(r) for r in rows]

    def get(self, sub_category_id: int):
        with get_conn() as conn:
            row = conn.execute("""
              SELECT id, category_id, name, image_path, sort_order, is_active, created_at, updated_at
              FROM sub_categories
              WHERE id=?
            """, (int(sub_category_id),)).fetchone()
        return dict(row) if row else None

    def create(self, payload: dict) -> int:
        with get_conn() as conn:
            cur = conn.execute("""
              INSERT INTO sub_categories(category_id, name, image_path, sort_order, is_active)
              VALUES (?, ?, ?, ?, ?)
            """, (
                int(payload["category_id"]),
                payload["name"],
                payload.get("image_path"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
            ))
            return cur.lastrowid

    def update(self, sub_category_id: int, payload: dict) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE sub_categories
              SET category_id=?,
                  name=?,
                  image_path=?,
                  sort_order=?,
                  is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (
                int(payload["category_id"]),
                payload["name"],
                payload.get("image_path"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
                int(sub_category_id)
            ))

    def toggle(self, sub_category_id: int, is_active: int) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE sub_categories
              SET is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (int(is_active), int(sub_category_id)))
