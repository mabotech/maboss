

#S_COMMON = ['id', 'seq', 'modifiedon', 'modifiedby', 'createdon','createdby','rowversion']

v_table = i_json.table
v_id = i_json.id
v_languageid = i_json.languageid

if not v_languageid
    return {"error":"please provide languageid"}

v_texths = "texths -> '#{v_languageid}\' as texths"

v_cols_str = '*'

if  i_json.cols and i_json.cols.length != 0

    v_cols_str = i_json.cols.join(', ')
    v_cols_str = v_cols_str.replace('texths',v_texths)



if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select #{v_cols_str}
    from #{v_table}
    where id='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"returning":rtn}

