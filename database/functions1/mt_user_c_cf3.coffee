
err = ""
try
    sql = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, '#{i_json.name}', 1, now(), '#{i_json.user}', now(), '#{i_json.user}')
     returning  id,lastupdateon
    "
    plv8.elog(LOG, sql)
    plv8.subtransaction(
        (sql) ->
        rtn = plv8.execute(sql)
        #err = "in subtransaction"
        #throw("test err")


    )
    return rtn[0];
catch err
    return {"error":err}
