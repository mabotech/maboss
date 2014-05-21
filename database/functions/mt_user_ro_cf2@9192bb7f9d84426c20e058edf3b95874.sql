CREATE OR REPLACE FUNCTION mt_user_ro_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "select * from mabotech.user where id = #{i_json.id}"

try
    rtn = plv8.execute(sql)
    if rtn.length == 0
        throw "no data found"
    return rtn[0]

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  