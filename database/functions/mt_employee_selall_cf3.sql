CREATE OR REPLACE FUNCTION mt_employee_selall_cf3(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where createdon>$1 or  name ilike $2"

v1 = i_json.v1
v2 = i_json.v2

data = {}
rtn = null
v = ""
try	
	plv8.subtransaction(()->
		plan = plv8.prepare(sql_select, v1)
		#v = Object.keys(plan)
		#rtn = plan.execute(v2)	
		cursor = plan.cursor()
		rtn = cursor.fetch()
		)
	return rtn
	if rtn.length == 0
		throw "no data found #{Object.keys(rtn)}"

	data = rtn #get_data(i_json.type, rtn)

catch error
	plv8.elog(LOG, sql_select, JSON.stringify(i_json))
	data = {"error_msg":"#{error}"}
finally
	
	if plan?
		plan.free()
	#return { "v":JSON.stringify(rtn)}
	return rtn
	
$BODY$
  LANGUAGE plcoffee VOLATILE
  