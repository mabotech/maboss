CREATE OR REPLACE FUNCTION mt_user_d_cf3(i_json json)
  RETURNS json AS
$BODY$

sql_update = "update mabotech.user 
	set active = 0, lastupdatedby = $1, lastupdateon = now() , rowversionstamp = rowversionstamp + 1
	where id = $2"

#plan = plv8.prepare(sql, ['character varying','integer'])
	
try	
	ct= plv8.execute(sql_update, [i_json.user, i_json.id]) 

	if ct == 0
		throw "not data found"
	
	return {"ct":ct};
catch error
	plv8.elog(LOG, sql_update,';json:',JSON.stringify(i_json))
	return {"error_msg":"#{error}"}
#finally
#	plan.free()
	
$BODY$
  LANGUAGE plcoffee VOLATILE
  