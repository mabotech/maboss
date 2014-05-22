CREATE OR REPLACE FUNCTION mtp_get_schema_cs3(i_json json)
  RETURNS json AS
$BODY$    
sql_select = "select c.column_name, c.ordinal_position, c.udt_name, 
	c.character_maximum_length , 
	c.is_nullable, 
	c.column_default, 
	c.data_type,
	fk.foreign_table_name,
	fk.foreign_column_name
	from information_schema.columns c
	LEFT JOIN ( SELECT
	    tc.constraint_name, tc.table_name, kcu.column_name as column_name, 
	    ccu.table_name AS foreign_table_name,
	    ccu.column_name AS foreign_column_name 
	FROM 
	    information_schema.table_constraints AS tc 
	    JOIN information_schema.key_column_usage AS kcu
	      ON tc.constraint_name = kcu.constraint_name
	    JOIN information_schema.constraint_column_usage AS ccu
	      ON ccu.constraint_name = tc.constraint_name
	WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name=$3) as fk

	on c.column_name = fk.column_name
	 
	where c.table_catalog = $1 and c.table_schema = $2 and c.table_name = $3
	and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
	order by c.ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
	return {"data":rtn}
else
	return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  