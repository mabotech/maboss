
#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.filter

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

if not v_filter
	v_filter = "true"
else

	conditons = []

	# OR
	for filter_arr in v_domain

	    filter_str = []
	    
	    ztmp = []
	    
	    # AND
	    for con in filter_arr
	    
		tmp = []
		tmp.push(con[0])
		tmp.push(con[1])
		
		if typeof(con[2]) == 'object'
		    
		    vlist = []
		    
		    arr = con[2]
		    
		    #add single quote for value
		    for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")
                
                arr_str = vlist.join(", ")
                arr_str = "(#{arr_str})"
                #in_ = [ con[0], con[1], arr_str ].join(' ')
                tmp.push(arr_str)
            
		
		if con[3] in ["char","varchar","timestamp"] or con.length == 3
			tmp.push("'#{con[2]}'")
		else:
		    tmp.push(con[2])
		
		ztmp.push(tmp)
		
	    for con in ztmp
	    
		v = con[0..2].join(' ')
		filter_str.push(v)    
	    
	    and_conditions = filter_str.join(" AND ")
	    
	    conditons.push("(#{and_conditions})")

	v_filter = conditons.join(' OR ')




if not v_orderby
	v_orderby = "1"	

if not v_offset
	v_offset = 0

if not v_limit
	v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter} and active = 1"

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
	where #{v_filter} and active = 1  
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
