CREATE OR REPLACE FUNCTION mt_user_u_pg1(i_id integer, i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

begin

update mabotech.user 
set name = i_name, 
lastupdateon = now(), lastupdatedby = i_user 
where id = i_id;

return 1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  