
##

domain = [ '|',
  [ 'project_id', '=', 'public' ],
  '!',['a','=','b'],
  '&',
  [ 'project_id', 'not in', [ 'portal', 'followers' ] ],
  '|',
  [ 'message_follower_ids', 'in', [ 'A', 'B' ] ],
  [ 'user_id', '=', 'user.id' ] ]


make_filter_str = (domain) ->
    n = domain.length

    st = []

    y = {"|":" OR ","&":" AND ", "!" : " NOT "}

    while n>0
        
        n = n - 1
        
        if domain[n] not in ["|","&", "!"]
            
            # in / not in 
            if typeof (domain[n][2]) == 'object'
            
                vlist = []
                
                arr = domain[n][2]
                
                #add single quote for value
                for i in [0 ..arr.length-1]
                    vlist.push("'#{arr[i]}'")
                
                arr_str = vlist.join(", ")
                arr_str = "(#{arr_str})"
                in_ = [ domain[n][0], domain[n][1], arr_str ].join(' ')
                st.push(in_)

            else
                #console.log("not obj")
                domain[n][2] = "'#{domain[n][2]}'"
                st.push(domain[n].join(' '))
        else
            
            conditions = st.join(" #{y[ domain[n] ]} ")
            st.pop()
            st.pop()
            st.push("(#{conditions})")

    #result
    return st.pop()
    
    
filters = make_filter_str(domain)

console.log(filters)