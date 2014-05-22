

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

select a.attname as column_name,
a.attnum as ordinal_position, 
t.typname as data_type, 
(a.atttypmod-4) as character_maximum_length, 
a.attnotnull as not_null,
def.adsrc as column_default,
array_length(c.conkey, 1) as not_composite,
c.contype as constraint_type,
c.conname as constraint_name,
-- p1.relname, 
 p2.relname as rel_table_name,
 a2.attname as rel_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid 
    and a.attstattarget <> 0
inner join pg_namespace n on (cls.relnamespace = n.oid )
inner join pg_catalog.pg_type t on a.atttypid = t.oid
left join pg_catalog.pg_attrdef def on (def.adrelid = a.attrelid and def.adnum = a.attnum )
left join pg_catalog.pg_constraint c on ( c.conrelid = a.attrelid and  a.attnum = any(c.conkey) )
left join pg_catalog.pg_class p1 on ( c.conrelid = p1.oid)
left join pg_catalog.pg_class p2 
     on ((case when c.confrelid =0 then c.conrelid else c.confrelid end)  = p2.oid)
left join pg_catalog.pg_attribute a2 on ( c.confrelid = a2.attrelid and  a2.attnum = any(c.confkey) )
where 
  cls.relname =i_json->>'table_name' 
  and n.nspname = i_json->>'schema' 
and
a.attname not in (
'referenceid',
'active',
'lastupdateon',
'lastupdatedby',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion',
'rowversionstamp'
)
order by ordinal_position 

)row;


return v_result;

end;


