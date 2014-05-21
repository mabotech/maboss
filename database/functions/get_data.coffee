

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

