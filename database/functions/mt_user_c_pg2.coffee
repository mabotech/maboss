

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning id, lastupdateon into v_id, v_lastupdateon;
 

 return v_id;

end;
