CREATE OR REPLACE FUNCTION mt_user_r_pg1(i_id integer)
  RETURNS json AS
$BODY$

declare 
	o_id integer;
	o_name varchar(60);
	o_json json;
begin

select --id, name into o_id, o_name 
row_to_json(row(id, name)) into o_json
from mabotech.user 
where id = 1 and active = 0;

 return o_json; --row_to_json(row(o_id, o_name, 3, 4, 'do'));
--return to_json('{"abc":123}'::text);
--return hstore_to_json(hstore(ARRAY[['id',o_id],['name',o_name]]));
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  