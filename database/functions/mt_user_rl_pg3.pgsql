
declare

  v_json json;
  v_limit int4;
  v_name varchar; 
	
begin

v_limit = i_json ->> 'limit';
v_name = i_json ->> 'name';

select json_agg( row_to_json(row) )into v_json 
from (
select u.id, u.name, u.createdon from mabotech.user u where u.name ilike v_name and u.active = 1 offset 0 limit v_limit
) row;

return v_json;

end;

