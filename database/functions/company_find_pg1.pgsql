
declare

  v_id uuid; 
  v_user varchar; 

  v_filter varchar;
  
  v_result json;

  v_total int8;
  v_count int4;

  v_sql text;

  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin
 
v_id = i_json ->> 'id';
v_user = i_json ->> 'user';
v_filter = i_json ->>'filter';

if v_filter is null then
	v_filter = 'true';
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
	select seq, company from company where '  || v_filter ||' offset 3 limit 10
) row';
 
execute v_sql into v_result, v_count ;

select row_to_json(row) into v_result
from(
	select v_total as total, v_count as count, v_result as result
)row;

return v_result;

end if;
end;
