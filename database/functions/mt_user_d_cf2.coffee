

sql = "update mabotech.user set active = 0, lastupdatedby = $1, lastupdateon = now() where id = $2"

plan = plv8.prepare(sql, ['character varying','integer'])
	
try	
	ct= plan.execute([i_json.user, i_json.id]) 

	if ct == 0
		throw "not data found"
	
	return {"ct":ct};
catch error
	plv8.elog(LOG, sql,';json:',JSON.stringify(i_json))
	return {"error_msg":"#{error}"}
finally
	plan.free()
	
