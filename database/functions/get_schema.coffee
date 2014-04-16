    
sql_select = "select column_name, udt_name, 
	character_maximum_length , 
	is_nullable, 
	column_default, 
	data_type
	from information_schema.columns 
	where table_catalog = $1 and table_schema = $2 and table_name = $3
	and column_name not in ('id', 'active', 'createdon', 'createdby', 'lastupdatedby', 'lastupdateon', 'rowversionstamp')
	order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
	return {"data":rtn}
else
	return {}

