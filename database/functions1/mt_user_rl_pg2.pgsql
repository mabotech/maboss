
declare

  v_json json;
  v_limit int4;
  v_name varchar; 
	
begin

v_limit = i_json -> 'limit';
v_name = i_json -> 'name';

select json_agg( row_to_json(row) ) into v_json 
from (select id, name, createdon from mabotech.user where name ilike concat(v_name, '%%') and active = 1  limit v_limit) row;

return v_json;

end;

