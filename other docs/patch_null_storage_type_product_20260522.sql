USE hktv_psos;

UPDATE psos_product
SET storage_type = 'H'
WHERE is_third_party_logistics_warehouse = 1
  AND is_consignment_warehouse = 0
  AND (storage_type IS NULL OR storage_type = '');