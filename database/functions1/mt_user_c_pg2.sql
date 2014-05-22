CREATE OR REPLACE FUNCTION mt_user_c_pg2(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning id, lastupdateon into v_id, v_lastupdateon;
 

 return v_id;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  