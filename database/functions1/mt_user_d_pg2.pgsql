

begin

update mabotech.user set active = 0 where id = i_id; -- returning id;

 return hstore_to_json_loose('"id"=>1,"msg"=>"ok"');
end;
