CREATE OR REPLACE FUNCTION mt_user_c_cf1(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$



sql = "
 insert into mabotech.user
(name, active, createdon, createdby, lastupdateon, lastupdatedby)
values('#{i_name}', 1, now(), '#{i_user}', now(), '#{i_user}')
"

plv8.execute(sql);

return 1;


$BODY$
  LANGUAGE plcoffee VOLATILE
  