

declare 
	o_id integer;
	o_name varchar(60);
begin

update mabotech.user set active = 0 where id = i_id; -- lastdeleteon, lastdeletredby

 return 1;
end;
