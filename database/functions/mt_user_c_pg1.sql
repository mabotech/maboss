CREATE OR REPLACE FUNCTION mt_user_c_pg1(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

 
begin

 insert into mabotech.user 
(name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(i_name, 1, now(), i_user, now(), i_user) ;

return 1;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  