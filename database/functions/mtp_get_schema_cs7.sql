CREATE OR REPLACE FUNCTION mtp_get_schema_cs7(i_json json)
  RETURNS json AS
$BODY$

sql_select = "
select a.attname as column_name,
a.attnum as ordinal_position, 
t.typname as data_type, 
(a.atttypmod-4) as character_maximum_length, 
a.attnotnull as is_nullable, 
'' as column_default,
fk.constraint_type as constraint_type,
fk.parent_table_name as co_table_name, 
fk.parent_col as co_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid 
    and  cls.relname ='#{i_json.table_name}' and a.attstattarget <> 0
inner join pg_type t on a.atttypid = t.oid
left join (
select 'f' as constraint_type, cls.relname as table_name, 'id' as parent_col, 
cls2.relname as parent_table_name , c.conkey[1] as original_position 
from pg_catalog.pg_constraint c 
inner join pg_catalog.pg_class cls on cls.oid = c.conrelid
inner join pg_catalog.pg_class cls2 on cls2.oid = c.confrelid
inner join pg_catalog.pg_class cls3 on cls3.oid = c.conindid
) fk on fk.table_name = cls.relname and fk.original_position = a.attnum
where a.attname not in (
'referenceid',
'active',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion'
)
order by ordinal_position
"

rtn = plv8.execute(sql_select)

if rtn.length>0
	return {"data":rtn}
else
	return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  