CREATE OR REPLACE FUNCTION mt_user_d_pg2(i_id integer)
  RETURNS json AS
$BODY$

begin

update mabotech.user set active = 0 where id = i_id; -- returning id;

 return hstore_to_json_loose('"id"=>1,"msg"=>"ok"');
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  