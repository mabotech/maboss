CREATE OR REPLACE FUNCTION mtp_upsert_cf3(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.kv.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.kv.rowversion

if not v_rowversion
	v_rowversion = 1

if not languageid
	#throw("please provide languageid")
	return {"error":"please provide languageid"}

for key in Object.keys(i_json.kv)

	if key == 'id'
		if i_json.kv['id'] != ''
			#update  = true
			v_id = i_json.kv['id']
		else
			continue

	cols.push(key)
	
	if key != 'texths'
		x = i_json.kv[key]

		if typeof(x) == 'string'
		
			y = x.split('::')
			
			if y.length == 2
				v = "'#{y[0]}'::#{y[1]}"
				vals.push(v)
			
			else
				v = "'#{x}'"
				vals.push(v)
		else
			vals.push(x)
	else
		val = i_json.kv[key]
		v = "hstore('#{languageid}', '#{val}')"
		vals.push(v)	

if v_id != undefined and v_id != ""
	#build update sql
	
	#c= cols.join(",")	 
	#v = vals.join(",")
	
	fields = []

	for i in [0 ..cols.length-1]

		col = cols[i]
		val = vals[i]

		if col in ["id","modifiedon","modifiedby","rowversion"]
			continue
		
		if col != "texths"
			fields.push("#{col} = #{val}")
		else
			fields.push("#{col} = #{col}||#{val}")
		
	setfields = fields.join(", ")
	
	v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1 
		where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, rowversion"
	
else
	#build insert sql

	t_cols = []
	t_vals = []

	for i in [0 .. cols.length-1 ]
		
		if cols[i] in ["id", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
			#alert?
			continue
		else
			t_cols.push(cols[i])
			t_vals.push(vals[i])

	v_cols= t_cols.join(", ")

	v_vals = t_vals.join(", ")

	v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby) 
			values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, createdon, rowversion"

try
	result = plv8.execute( v_sql )
catch err
	plv8.elog(DEBUG, v_sql)
	msg = "#{err},#{v_sql}"
	#return {"sql":v_sql,"error":msg}
	throw(msg)
	
return {"result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  