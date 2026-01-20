from backend.db import get_conn

class ProductRepository:
    def list_by_sub_category(self, sub_category_id: int, include_inactive: bool = True):
        sql = """
          SELECT id, sub_category_id, sku, name, base_price, image_path,
                 sort_order, is_active, created_at, updated_at
          FROM products
          WHERE sub_category_id=?
        """
        params = [int(sub_category_id)]
        if not include_inactive:
            sql += " AND is_active=1"
        sql += " ORDER BY sort_order ASC, id ASC"

        with get_conn() as conn:
            rows = conn.execute(sql, params).fetchall()
        return [dict(r) for r in rows]

    def get(self, product_id: int):
        with get_conn() as conn:
            row = conn.execute("""
              SELECT id, sub_category_id, sku, name, base_price, image_path,
                     sort_order, is_active, created_at, updated_at
              FROM products
              WHERE id=?
            """, (int(product_id),)).fetchone()
        return dict(row) if row else None

    def create(self, payload: dict) -> int:
        with get_conn() as conn:
            cur = conn.execute("""
              INSERT INTO products(sub_category_id, sku, name, base_price, image_path, sort_order, is_active)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                int(payload["sub_category_id"]),
                payload.get("sku"),
                payload["name"],
                float(payload.get("base_price", 0)),
                payload.get("image_path"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
            ))
            return cur.lastrowid

    def update(self, product_id: int, payload: dict) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE products
              SET sub_category_id=?,
                  sku=?,
                  name=?,
                  base_price=?,
                  image_path=?,
                  sort_order=?,
                  is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (
                int(payload["sub_category_id"]),
                payload.get("sku"),
                payload["name"],
                float(payload.get("base_price", 0)),
                payload.get("image_path"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
                int(product_id)
            ))

    def toggle(self, product_id: int, is_active: int) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE products
              SET is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (int(is_active), int(product_id)))
