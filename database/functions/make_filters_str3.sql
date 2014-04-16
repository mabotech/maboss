CREATE OR REPLACE FUNCTION make_filters_str3(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

n = v_domain.length

st = []

y = {"|":" OR ","&":" AND ", "!" : " NOT "}

while n>0
    
    n = n - 1
    
    if v_domain[n] not in ["|","&", "!"]
        
        # in / not in 
        if typeof (v_domain[n][2]) == 'object'
        
            vlist = []
            
            arr = v_domain[n][2]
            
            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")
            
            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            in_ = [ v_domain[n][0], v_domain[n][1], arr_str ].join(' ')
            st.push(in_)

        else
            #console.log("not obj")
            v_domain[n][2] = "'#{v_domain[n][2]}'"
            st.push(v_domain[n].join(' '))
    else
        if v_domain[n] == "!"
            # NOT
            #conditions = st.join("")
            conditions = st.pop()
            st.push(" NOT (#{conditions})" )
        else
            # AND / OR
            conditions = st.join(" #{y[ v_domain[n] ]} ")
            st.pop()
            st.pop()
            st.push("(#{conditions})")

#result
return st.pop()

    
$BODY$
  LANGUAGE plcoffee VOLATILE
  