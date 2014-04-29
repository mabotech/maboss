CREATE OR REPLACE FUNCTION mtp_upsert_cf5(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

if not v_rowversion
	v_rowversion = 1

if not languageid
	#throw("please provide languageid")
	return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

	if key == 'id'
		if i_json.columns['id'] != null and i_json.columns['id'] != ''
			#update  = true
			v_id = i_json.columns['id']
		else
			continue

	
	
	if key == 'texths'
		val = i_json.columns[key]

		if val != null
			#if no value for hstore then bypass
			cols.push(key)
		
			if typeof(val) == 'string'
				val = val.replace("'","''") # escape single quote
			v = "hstore('#{languageid}', '#{val}')"
			vals.push(v)
	else
		cols.push(key)
		val = i_json.columns[key]

		if typeof(val) == 'string'
		
			y = val.split('::')
			
			if y.length == 2
				v = "'#{y[0]}'::#{y[1]}"
				vals.push(v)
			
			else
				val = val.replace("'","''")  # escape single quote
				v = "'#{val}'"
				vals.push(v)
		else
			vals.push(val)

if v_id != undefined and v_id != "" and v_id != null
	#build update sql
	
	#c= cols.join(",")	 
	#v = vals.join(",")
	
	fields = []

	for i in [0 ..cols.length-1]

		col = cols[i]
		val = vals[i]

		if val == null
			continue

		if col in ["id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
			continue
		
		if col == "texths"
			#fields.push("#{col} = #{col}||#{val}")
			fields.push("#{col} = #{val}")
		else
			
			fields.push("#{col} = #{val}")
		
	setfields = fields.join(", ")
	
	v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1 
		where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, modifiedby, createdon, createdby, rowversion"
	
else
	#build insert sql

	t_cols = []
	t_vals = []

	for i in [0 .. cols.length-1 ]

		col = cols[i]
		val = vals[i]
		if val == null
			continue
		if col in ["id", "seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
			#alert?
			continue
		else
			t_cols.push(col)
			t_vals.push(val)

	v_cols= t_cols.join(", ")

	v_vals = t_vals.join(", ")

	v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby) 
			values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, modifiedon, modifiedby, createdon, createdby, rowversion"

try
	result = plv8.execute( v_sql )
catch err
	plv8.elog(DEBUG, v_sql)
	msg = "#{err},#{v_sql}"
	#return {"sql":v_sql,"error":msg}
	throw(msg)
	
return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  