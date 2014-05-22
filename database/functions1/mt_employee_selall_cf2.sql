CREATE OR REPLACE FUNCTION mt_employee_selall_cf2(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where id>$1 or  name ilike $2 order by id"

v1 = i_json.v1
v2 = i_json.v2

data = {}

try
    rtn =plv8.execute(sql_select, v2)

    if rtn.length == 0
        throw "no data found"

    data = get_data(i_json.type, rtn)

catch error
    plv8.elog(LOG, sql_select, JSON.stringify(i_json))
    data = {"error_msg":"#{error}"}

return data

$BODY$
  LANGUAGE plcoffee VOLATILE
  