

v_table = i_json.table

v_id = i_json.id

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select *
    from #{v_table}
    where id='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"result":rtn}

