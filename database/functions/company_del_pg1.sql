CREATE OR REPLACE FUNCTION company_del_pg1(i_json json)
  RETURNS json AS
$BODY$
declare

  v_id uuid; 
  v_user varchar; 
  v_result json;

  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin
 
v_id = i_json ->> 'id';
v_user = i_json ->> 'user';

-- logic delete 
update company 
	set active = 0, modifiedon = now(), modifiedby = v_user, rowversionstamp = rowversionstamp + 1
where id = v_id	and active = 1
	returning modifiedon, rowversionstamp into v_modifiedon, v_rowversionstamp;

-- construct output json 
select row_to_json(row) into v_result
from(
	select v_id as id,v_modifiedon as modifiedon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  