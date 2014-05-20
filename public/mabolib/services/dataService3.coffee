"use strict"

#uglifyjs dataService.js -b  --comments all 
###
Data  Services
###
angular.module("service.dataService", []).factory "dataService", [
    "jsonrpc"
    "$log"
    (jsonrpc, $log) ->
        
        #methods
        return (
            
            #
            #            * get  value - text for select 2
            #            
            getkv: (options) ->
                options.method = "mtp_select_cf2"
                options.value = options.text
                jsonrpc.call options

            
            #
            #            *   get value - text  on demand for select 2
            #            
            getkv2: (options) ->

            
            #
            #            * save
            #            
            save: (options) ->
                options.method = "mtp_upsert_cs8"
                options.columns = options.model
                jsonrpc.call options

            
            # <- end save()
            ###
            delete
            ###
            del: (options) ->
                options.method = "mtp_delete_cf2"
                jsonrpc.call options

            
            # <- end delete
            ###
            get
            ###
            get: (options) ->
                options.method = "mtp_fetch_one_cf1"
                options.cols = Object.keys(options.model)
                jsonrpc.call options

            
            # <- end delete
            ###
            fetch
            ###
            fetch: (options) ->
                
                # method
                options.method = "mtp_search_cf4"
                jsonrpc.call options
        )
]
