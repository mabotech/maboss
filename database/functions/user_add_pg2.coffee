
declare
  v_name varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_lastupdateon timestamp;
  v_rowversionstamp int8;

begin

v_name = i_json ->> 'name';
v_user = i_json ->> 'user';

 
insert into mabotech.user 
	 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
	 values(DEFAULT, v_name, 1, now(), v_user, now(), v_user)  
	 returning id,lastupdateon, rowversionstamp into v_id, v_lastupdateon, v_rowversionstamp;

 
select row_to_json(row) into v_result
from(
select v_name as name, v_id as id,v_lastupdateon as lastupdateon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
