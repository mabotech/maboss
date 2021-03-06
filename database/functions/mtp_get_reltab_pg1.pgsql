

declare

v_result json;

v_type varchar;


begin

v_type = i_json ->>'type';

if v_type = 'c' then
-- children table
select  json_agg(row_to_json(row)) into v_result
from(

SELECT  p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p2.relname = i_json ->>'table_name'

)row;

else 
-- foreign table
select  json_agg(row_to_json(row)) into v_result
from(
SELECT   p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p1.relname = i_json ->>'table_name'

)row;


end if;

return v_result;

end;


