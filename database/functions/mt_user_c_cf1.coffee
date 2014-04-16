

 
 
sql = "
 insert into mabotech.user 
(name, active, createdon, createdby, lastupdateon, lastupdatedby)
values('#{i_name}', 1, now(), '#{i_user}', now(), '#{i_user}') 
"

plv8.execute(sql);

return 1;

 
