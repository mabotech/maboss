

get_data = plv8.find_function("mabotech.get_data");

sql = "select id, name, createdon 
	from mabotech.user 
	where active = 1 
	offset 3 limit 5 "

try	
	rtn = plv8.execute(sql)	
	
	if rtn.length == 0
		throw "no data found"

	return get_data(i_json, rtn)
	
catch error
	plv8.elog(LOG, sql, JSON.stringify(i_json))
	return {"error_msg":"#{error}"}

