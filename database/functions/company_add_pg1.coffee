
declare
  v_company varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin

v_company = i_json ->> 'company';
v_user = i_json ->> 'user';

 
insert into company 
	 (id, company, active, modifiedon, modifiedby,createdon, createdby)
	 values(uuid_generate_v4(), v_company, 1, now(), v_user, now(), v_user)  
	 returning id, modifiedon, rowversionstamp into v_id, v_modifiedon, v_rowversionstamp;

 
select row_to_json(row) into v_result
from(
select v_company as company, v_id as id,v_modifiedon as modifiedon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
