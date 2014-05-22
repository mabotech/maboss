CREATE OR REPLACE FUNCTION mt_user_rl_pg4(i_json json)
  RETURNS json AS
$BODY$
declare

  v_json json;
  v_result json;  
  v_limit int4;
  v_name varchar;
  v_count int4; 

  v_total int4;
  
begin

v_limit = i_json ->> 'limit';
v_name = i_json ->> 'name';

-- calculate total
select count(1) into v_total from mabotech.user u where u.name ilike v_name and u.active = 1;

-- construct query json
select json_agg( row_to_json(row)), count(row) into v_json , v_count
from (
select u.id, u.name, u.createdon from mabotech.user u where u.name ilike v_name and u.active = 1 
	offset 0 limit v_limit
) row;

-- construct result json
select row_to_json(row) into v_result
from
(select v_count as rowcount, v_total as total, v_json as result ) row;

-- log to server log
if v_count > 2 then
    raise WARNING 'waring in pgsql';
end if;

return v_result;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  