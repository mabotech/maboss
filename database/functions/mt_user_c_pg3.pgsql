

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning mabotech.user.id, mabotech.user.lastupdateon into v_id, v_lastupdateon;
 

 return query select v_id, v_lastupdateon;

end;
