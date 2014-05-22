

rtn = null
rtn2 = null

sql_insert = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon, rowversionstamp
    "
#plv8.subtransaction(()->
rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
rtn2 = plv8.execute("select now()")

rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
rtn2 = plv8.execute("select now()")

#    )

return {result:rtn[0], time:rtn2[0]['now']}

