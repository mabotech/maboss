CREATE OR REPLACE FUNCTION mt_user_u_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "update mabotech.user
    set name = $1,
    lastupdatedby = $2, lastupdateon = now()
    where id = $3 returning id, lastupdateon"

plan = plv8.prepare(sql, ['character varying','character varying','integer'])

try
    ct= plan.execute([i_json.name, i_json.user, i_json.id])

    if ct.length == 0
        throw "not data found"

    return ct[0]

catch error
    plv8.elog(LOG, sql)
    return {"error_msg":"#{error}"}
finally
    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  