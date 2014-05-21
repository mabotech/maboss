

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

