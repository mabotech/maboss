"use strict"

#uglifyjs contextService.js -b  --comments all 
###
Mabo Services
###
angular.module("service.helpers", []).factory "helpers", ->
    
    #
    #            get context
    #            
    log: (msg)->
        console.log(msg)
    ,
    get_sysdata :(data) ->
        
        system = {}
        
        cols = ["modifiedon","modifiedby","createdon","createdby","rowversion"]
        
        for col in cols
            system[col] = data[col]
            
        return system