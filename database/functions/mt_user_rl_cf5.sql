CREATE OR REPLACE FUNCTION mt_user_rl_cf5(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name, createdon 
	from mabotech.user 
	where active = 1 and name ilike $1
	offset $2 limit $3 "

try	
	rtn = plv8.execute(sql_select, [i_json.name, i_json.offset, i_json.limit])	
	
	if rtn.length == 0
		throw "no data found"

	return get_data(i_json.type, rtn)
	
catch error
	plv8.elog(LOG, sql_select, JSON.stringify(i_json))
	return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  