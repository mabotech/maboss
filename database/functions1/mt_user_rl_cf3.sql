CREATE OR REPLACE FUNCTION mt_user_rl_cf3(i_json json)
  RETURNS json AS
$BODY$

#----------------------------
get_data =(rtn) ->

    keys = Object.keys(rtn[0])

    # array of row data
    if i_json.type ==1

        data = []
        for item in rtn
            row =  (item[key] for key in keys)
            data.push(row)

        return {"keys":keys, "data":data}

    # array of column data
    else if i_json.type == 2

        cols = {}
        for item in keys
            cols[item] = []

        for item in keys
            for i in [0..rtn.length-1]
                cols[item].push(rtn[i][item])

        return {"keys":keys, "data":cols}
    else
        return {"keys":keys, "data":rtn}

#----------------------------

sql = "select id, name, createdon
    from mabotech.user
    where active = 1
    offset 3 limit 5 "

try
    rtn = plv8.execute(sql)

    if rtn.length == 0
        throw "no data found"

    return get_data(rtn)

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  