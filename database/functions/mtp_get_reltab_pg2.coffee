

declare

v_table_p json;
v_table_c json;

v_result json;

 

begin

 
-- children table
select  json_agg(row_to_json(row)) into v_table_c
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

 
-- foreign table
select  json_agg(row_to_json(row)) into v_table_p
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

 

select  row_to_json(row) into v_result
from(
  select v_table_c as c_tab, v_table_p as p_tab
)row;

return v_result;

end;


