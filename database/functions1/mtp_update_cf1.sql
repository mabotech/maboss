CREATE OR REPLACE FUNCTION mtp_update_cf1(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_id = i_json.id

v_user = i_json.user

v_sql = "update #{v_table}
    set active=0, modifiedon=now(), modifiedby='#{v_user}', rowversion = rowversion + 1
    where id = '#{v_id}'"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"id":v_id, "result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  