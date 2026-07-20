use hktv_psos;

SELECT * FROM hktv_psos.psos_product
where storage_type IS NULL OR storage_type = '';