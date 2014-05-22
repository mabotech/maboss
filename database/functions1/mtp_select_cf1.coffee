

#init
msg = ""

#input
v_table = i_json.table

# key-value
v_key = i_json.key
v_value = i_json.value
v_value_t = v_value

v_languageid = i_json.languageid

v_filter = i_json.filter

# pagination
v_offset = i_json.offset
v_limit = i_json.limit
v_orderby = i_json.orderby

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if v_value == "texths"
    v_value = "texths->'#{v_languageid}' as texths"
    v_value_t = "texths->'#{v_languageid}'"

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    v_filter = "#{v_value_t} ilike '#{v_filter}%'"
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

v_sql = "select #{v_key}, #{v_value}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

count = rows.length

return {"total":total, "count":count,  "rows":rows}

