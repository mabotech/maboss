CREATE OR REPLACE FUNCTION mtp_search_cf2(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
	#throw("please provide languageid")
	v_languageid = 1033
	#return {"error":"please provide languageid"}

if i_json.cols

	for i in [0 .. i_json.cols.length-1]
		if i_json.cols[i] == "texths"
			i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
	v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
	v_filter = "true"
else
	make_filters_str = plv8.find_function("make_filters_str");

	v_filter= make_filters_str({"domain":v_filter})

if not v_orderby
	v_orderby = "1"	

if not v_offset
	v_offset = 0

if not v_limit
	v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
	total = plv8.execute( v_sql )[0]["total"]
catch err
	plv8.elog(DEBUG, v_sql)
	msg = "#{err}"
	return {"error":msg, "sql": v_sql}
	
if total== 0
	
	return {"error":"no data"}

v_sql = "select #{v_cols} 
	from #{v_table} 
	where #{v_filter}  
	order by #{v_orderby} 
	offset #{v_offset} limit #{v_limit}"

try
	rtn = plv8.execute(v_sql)
catch err
	plv8.elog(DEBUG, v_sql)
	msg = "#{err}"
	return {"error":msg, "sql": v_sql}
	


count = rtn.length

return {"total":total, "count":count,  "result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  