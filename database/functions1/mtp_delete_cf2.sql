CREATE OR REPLACE FUNCTION mtp_delete_cf2(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_ids = i_json.ids.map((id)->"'#{id}'")

v_ids_str = v_ids.join(",")

v_user = i_json.user

v_sql = "update #{v_table}
    set active=0, modifiedon=now(), modifiedby='#{v_user}', rowversion = rowversion + 1
    where id in (#{v_ids_str}) returning id, modifiedon"

try
    rtn = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"returning":rtn, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  