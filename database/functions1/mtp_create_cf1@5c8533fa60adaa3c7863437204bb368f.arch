CREATE OR REPLACE FUNCTION mtp_create_cf1(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_id = i_json.id

v_user = i_json.user

v_sql = "insert into #{v_table} 
	(#{v_cols}, modifiedon, modifiedby, createdon, createdby) 
	values(#{v_values}, now(), '#{v_user}', now(), '#{v_user}') returning id, createdon"

try
	result = plv8.execute( v_sql )
catch err
	plv8.elog(DEBUG, v_sql)
	msg = "#{err}"

return {"id":v_id, "result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  