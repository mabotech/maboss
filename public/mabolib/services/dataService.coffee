"use strict"

#uglifyjs dataService.js -b  --comments all
###
Data  Services
###
angular.module("service.dataService", []).factory "dataService", [
    "$q"
    "jsonrpc"
    "$log"
    ($q, jsonrpc, $log) ->

        return (
            
            ###
            get  value - text for select 2
            ###
            getkv: (options) ->
                options.method = "mtp_select_cf2"
                options.value = options.text
                jsonrpc.call options

            
            ###
            get value - text  on demand for select 2
            ###
            getkv2: (options) ->
                jsonrpc.call options
            
            ###
            save one
            ###
            save: (options) ->
                options.method = "mtp_upsert_cs8"
                options.columns = options.model
                jsonrpc.call options

            ###
            delete one or some
            ###
            del: (options) ->
                options.method = "mtp_delete_cf2"
                jsonrpc.call options

            ###
            get one
            ###
            get: (options) ->
                options.method = "mtp_fetch_one_cf1"
                options.cols = Object.keys(options.model)
                jsonrpc.call options
                
            ###
            fetch some
            ###
            fetch: (options) ->
                options.method = "mtp_search_cs5"                
                jsonrpc.call options 
 
        )
]
