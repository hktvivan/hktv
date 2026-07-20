use hktv_psos;
SELECT il.id, il.available_qty_change, il.arriving_qty_change, il.departing_qty_change, il.available_qty, il.arriving_qty,
il.departing_qty, il.reference_type, il.reference_id, il.store_code, il.product_code, il.creation_date, il.created_by
FROM psos_inventory AS inv
JOIN psos_inventory_log as il ON il.id =
(SELECT id FROM psos_inventory_log where store_code = inv.store_code AND product_code = inv.product_code
ORDER BY creation_date DESC, id DESC LIMIT 0, 1 )
WHERE inv.available_qty != il.available_qty OR inv.arriving_qty != il.arriving_qty OR inv.departing_qty != il.departing_qty;