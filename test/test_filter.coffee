

domain =  [ [ [ 'a', '=', '1', 'int' ],
                    [ 'b', 'ilike', 'a5%', 'varchar' ],
                    [ 'c', '<', '100', 'int' ] ]                 ,
                [ [ 'e', '=', 'name', 'varchar' ], [ 'f', '>', '10', 'int' ] ] ]


#console.log(domain)

conditons = []
for cor in domain
    #console.log(cor)
    x = []
    
    ztmp = []
    
    for con in cor
        tmp = []
        tmp.push(con[0])
        tmp.push(con[1])
            
        #console.log(con[3])
        
        if con[3] in ["char","varchar","timestam"] or con.length == 3
                tmp.push("'#{con[2]}'")
        else:
            tmp.push(con[2])
        
        ztmp.push(tmp)
        
    for con in ztmp
        #console.log(con)
        
        v = con[0..2].join(' ')
        #console.log(v)
        x.push(v)
        
    z = x.join(" AND ")
    #console.log(z)
    conditons.push("(#{z})")
    
    
console.log(conditons.join(' OR ') )