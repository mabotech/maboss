CREATE OR REPLACE FUNCTION mt_user_c_pg3(i_name character varying, i_user character varying)
  RETURNS TABLE(id integer, lastupdateon timestamp without time zone) AS
$BODY$

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning mabotech.user.id, mabotech.user.lastupdateon into v_id, v_lastupdateon;
 

 return query select v_id, v_lastupdateon;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  