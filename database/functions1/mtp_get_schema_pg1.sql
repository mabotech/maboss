CREATE OR REPLACE FUNCTION mtp_get_schema_pg1(i_json json)
  RETURNS json AS
$BODY$

declare



v_table_name varchar;
v_catalog varchar;
v_schema varchar;

 v_result json;
 v_column_name varchar;

begin

v_table_name = i_json ->>'table_name';
v_catalog = i_json ->>'catalog';
v_schema = i_json ->>'schema';

select c.column_name into v_column_name
/*, c.ordinal_position, c.udt_name, 
	c.character_maximum_length , 
	c.is_nullable, 
	c.column_default, 
	c.data_type,
	co.constraint_type,
	co.co_table_name,
	co.co_column_name */
	from information_schema.columns c
	/*
	LEFT JOIN ( SELECT
	    substr(tc.constraint_type,1,1) as constraint_type,
	    tc.constraint_name, tc.table_name, kcu.column_name as column_name, 
	    ccu.table_name AS co_table_name,
	    ccu.column_name AS co_column_name 
	FROM 
	    information_schema.table_constraints AS tc 
	    JOIN information_schema.key_column_usage AS kcu
	      ON tc.constraint_name = kcu.constraint_name
	    JOIN information_schema.constraint_column_usage AS ccu
	      ON ccu.constraint_name = tc.constraint_name
	WHERE tc.constraint_type in ('PRIMARY KEY', 'FOREIGN KEY') AND tc.table_name=v_table_name ) as co

	on c.column_name = co.column_name
	*/
	where c.table_catalog = v_catalog and c.table_schema = v_schema and c.table_name = v_table_name
	and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
	order by c.ordinal_position;


select row_to_json(row) into v_result
from(
	select v_column_name as result
)row;

return v_result;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  