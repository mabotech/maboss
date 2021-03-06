CREATE OR REPLACE FUNCTION mtp_get_ctable_pg1(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

SELECT n.nspname AS namespace, p1.relname AS ctable, p2.relname as ptable, pg_get_constraintdef(c.oid) as ppkey
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2
	
--	pg_attribute a1, 
--	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	--AND c.conrelid = a1.attrelid
	--AND a1.attnum = ANY (c.conkey)
	--AND c.confrelid = a2.attrelid
	--AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p2.relname = i_json ->>'table_name'
order by 3
)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  