# backend/repositories/product_variant_repository.py  (FULL with delete)
from backend.db import get_conn

class ProductVariantRepository:
    def list_by_product(self, product_id: int, include_inactive: bool = True):
        sql = """
          SELECT id, product_id, name, price_delta, sku, sort_order, is_active, created_at, updated_at
          FROM product_variants
          WHERE product_id=?
        """
        params = [int(product_id)]
        if not include_inactive:
            sql += " AND is_active=1"
        sql += " ORDER BY sort_order ASC, id ASC"

        with get_conn() as conn:
            rows = conn.execute(sql, params).fetchall()
        return [dict(r) for r in rows]

    def get(self, variant_id: int):
        with get_conn() as conn:
            row = conn.execute("""
              SELECT id, product_id, name, price_delta, sku, sort_order, is_active, created_at, updated_at
              FROM product_variants
              WHERE id=?
            """, (int(variant_id),)).fetchone()
        return dict(row) if row else None

    def create(self, payload: dict) -> int:
        with get_conn() as conn:
            cur = conn.execute("""
              INSERT INTO product_variants(product_id, name, price_delta, sku, sort_order, is_active)
              VALUES (?, ?, ?, ?, ?, ?)
            """, (
                int(payload["product_id"]),
                payload["name"],
                float(payload.get("price_delta", 0)),
                payload.get("sku"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
            ))
            return cur.lastrowid

    def update(self, variant_id: int, payload: dict) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE product_variants
              SET product_id=?,
                  name=?,
                  price_delta=?,
                  sku=?,
                  sort_order=?,
                  is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (
                int(payload["product_id"]),
                payload["name"],
                float(payload.get("price_delta", 0)),
                payload.get("sku"),
                int(payload.get("sort_order", 0)),
                int(payload.get("is_active", 1)),
                int(variant_id)
            ))

    def toggle(self, variant_id: int, is_active: int) -> None:
        with get_conn() as conn:
            conn.execute("""
              UPDATE product_variants
              SET is_active=?,
                  updated_at=datetime('now')
              WHERE id=?
            """, (int(is_active), int(variant_id)))

    def delete(self, variant_id: int) -> None:
        with get_conn() as conn:
            conn.execute("DELETE FROM product_variants WHERE id=?", (int(variant_id),))
