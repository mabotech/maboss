

v_domain = i_json.domain

v_languageid = i_json.languageid

conditons = []

# OR
for filter_arr in v_domain

    filter_str = []
    
    ztmp = []
    
    # AND
    for con in filter_arr
    
        tmp = []

        if con[0] == "texths"
             v = "texths -> '#{v_languageid}'"
             tmp.push(v)
        else
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
    
    
filters = conditons.join(' OR ')

return filters

    
