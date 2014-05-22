CREATE OR REPLACE FUNCTION mt_user_u_cf3(i_json json)
  RETURNS json AS
$BODY$

sql_update = "update mabotech.user 
	set name = $1, 
	lastupdatedby = $2, lastupdateon = now() , rowversionstamp = rowversionstamp + 1
	where id = $3 and rowversionstamp = $4 returning id, lastupdateon, rowversionstamp"

#plan = plv8.prepare(sql, ['character varying','character varying','integer'])
	
try	
	ct= plv8.execute(sql_update, [i_json.name, i_json.user, i_json.id, i_json.rowversionstamp]) 

	if ct.length == 0
		throw "not data found or rowversionstamp conflict"
	
	return ct[0]
	
catch error
	plv8.elog(LOG, sql_update)
	return {"error_msg":"#{error}"}
#finally
#	plan.free()
	
$BODY$
  LANGUAGE plcoffee VOLATILE
  