CREATE OR REPLACE FUNCTION mt_employee_selall_cf1(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where createdon>$1 or  name ilike $2"

v1 = i_json.v1
v2 = i_json.v2

data = {}
rtn = []
v = ""
try	
	plv8.subtransaction(()->
		plan = plv8.prepare(sql_select, v1)
		v = Object.keys(plan)
		rtn = plan.execute(v2)	
		)
	
	if rtn.length == 0
		throw "no data found"

	data = get_data(i_json.type, rtn)

catch error
	plv8.elog(LOG, sql_select, JSON.stringify(i_json))
	data = {"error_msg":"#{error}", "plan":Object.keys(plan)}
finally
	
	if plan?
		plan.free()
	return {"data":data,  "plan":v}
	
$BODY$
  LANGUAGE plcoffee VOLATILE
  