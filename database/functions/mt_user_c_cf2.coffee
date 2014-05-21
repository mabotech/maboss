

sql = "
 insert into mabotech.user
 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
 values(DEFAULT, '#{i_name}', 1, now(), '#{i_user}', now(), '#{i_user}')
 returning  id,lastupdateon
"

rtn = plv8.execute(sql);

return rtn[0];

