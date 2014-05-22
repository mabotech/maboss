

begin

update mabotech.user 
set name = i_name, 
lastupdateon = now(), lastupdatedby = i_user 
where id = i_id;

return 1;
end;
