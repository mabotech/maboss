

sql = "select * from mabotech.mt_user_c_pg3($1,$2)"

plan = plv8.prepare(sql, ['character varying','character varying'])

try
    rtn = plan.execute([i_json.name, i_json.user])
    return rtn[0];
catch error
    plv8.elog(ERROR, sql)
    return {"errormsg":"#{error}"}
finally
    plan.free()

