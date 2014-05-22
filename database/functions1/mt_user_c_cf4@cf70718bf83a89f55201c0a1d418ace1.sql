CREATE OR REPLACE FUNCTION mt_user_c_cf4(i_json json)
  RETURNS json AS
$BODY$

try
    sql = "select * from mabotech.mt_user_c_pg3('#{i_json.name}','#{i_json.user}'::int8)"


    rtn = plv8.execute(sql)

    return rtn[0];
catch error
    plv8.elog(ERROR, sql)
    return {"errormsg":"#{error}"}
$BODY$
  LANGUAGE plcoffee VOLATILE
  