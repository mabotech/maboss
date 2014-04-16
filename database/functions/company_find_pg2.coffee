
declare

  v_filter varchar;
  v_offset int4;
  v_limit int4;
  
  v_result json;

  v_total int8;
  v_count int4;

  v_sql text;

begin
 

v_filter = i_json ->>'filter';
v_offset = i_json ->>'offset';
v_limit = i_json ->>'limit';

if v_filter is null then
	v_filter = 'true';
end if;

if v_offset is null then
	v_offset = 0;
end if;

if v_limit is null then
	v_limit = 25;
end if;

v_sql = 'select count(1)  from company where '  ||  v_filter;

raise WARNING  'select count(1)  from company where %' , v_filter;

execute v_sql into v_total; -- using v_filter, 'n%';
 
-- IF NOT FOUND THEN
if v_total = 0 then
   select row_to_json(row) into v_result
   from(
   select  'error' as error 
   )row;
   return v_result;
else

-- construct output json
v_sql = 'select json_agg(row_to_json(row)), count(row)
from(
	select seq, company from company where '  || v_filter || ' offset ' || v_offset || ' limit ' || v_limit ||
') row';
 
execute v_sql into v_result, v_count ;

select row_to_json(row) into v_result
from(
	select v_total as total, v_count as count, v_result as result
)row;

return v_result;

end if;
end;
