

sql_insert = "
     insert into company
     (id, company, active, modifiedon, modifiedby, createdon, createdby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,modifiedon, rowversion
    "

rtn = plv8.execute(sql_insert, [i_json.company, i_json.user])


return rtn[0]

