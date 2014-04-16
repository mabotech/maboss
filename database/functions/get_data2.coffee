

keys = Object.keys(rawdata[0])

# array of row data
if i_type ==1
	
	data = []
	for item in rawdata
		row =  (item[key] for key in keys)
		data.push(row)
	
	return {"keys":keys, "data":data}

# array of column data
else if i_type == 2

	cols = {}
	for item in keys
		cols[item] = []

	for item in keys
		for i in [0..rawdata.length-1]
			cols[item].push(rawdata[i][item])
			
	return {"keys":keys, "data":cols}
else
	return {"keys":keys, "data":rawdata}

