

sql = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon
    "

plan = plv8.prepare(sql, ['character varying','character varying'])

try
    rtn = plan.execute([i_json.name, i_json.user])
    return rtn[0];
catch error
    plv8.elog(LOG, sql)
    return {"error_msg":"#{error}"}
finally
    plan.free()

