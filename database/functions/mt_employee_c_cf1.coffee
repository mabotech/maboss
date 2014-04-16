
sql_insert = "
	 insert into mabotech.employee 
	 (id, name, translation, active, createdon, createdby, lastupdateon, lastupdatedby)
	 values(DEFAULT, $1, hstore($2,$3), 1, now(), $4, now(), $4)  
	 returning id,lastupdateon, rowversionstamp
	"
try	
	rtn = plv8.execute(sql_insert, [i_json.name, i_json.language, i_json.text,  i_json.user]) 
	return rtn[0];
catch error
	plv8.elog(LOG, sql_insert)
	return {"error_msg":"#{error}"}
