
declare
  v_company varchar;
  v_user varchar; 

  v_result json;

  v_id uuid; 
  v_modifiedon timestamp;
  v_rowversion int8;

begin

v_company = i_json ->> 'company';
v_user = i_json ->> 'user';

 
insert into company 
	 (company, active, modifiedon, modifiedby,createdon, createdby)
	 values(v_company, 1, now(), v_user, now(), v_user)  
	 returning id, modifiedon, rowversion into v_id, v_modifiedon, v_rowversion;

 
select row_to_json(row) into v_result
from(
select v_company as company, v_id as id,v_modifiedon as modifiedon, v_rowversion as rowversion
) row;

return v_result;

end;
