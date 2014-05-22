CREATE OR REPLACE FUNCTION mt_user_rl_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "select * from mabotech.user where active = 1 offset 3 limit 3 "

try	
	rtn = plv8.execute(sql)	
	if rtn.length == 0
		throw "no data found"
	return rtn
	
catch error
	plv8.elog(LOG, sql, JSON.stringify(i_json))
	return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  