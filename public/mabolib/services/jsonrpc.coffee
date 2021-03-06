"use strict"

###
jsonrpc client for angular
uglifyjs jsonrpc.js -b  --comments all 
###
angular.module("service.jsonrpc", []).factory "jsonrpc", [
    "$q"
    "$http"
    "$log"
    ($q, $http, $log) ->
        
        defaults = @defaults = {}
        
        id = 0
        defaults.basePath = "/rpc"
        defaults.url =  "/api/callproc.call"
        
        ###
        call remote method in jsonrpc, accept: application/json
        @options
        ###
        return call: (options) ->
            ###
            deferred must be declared local
            ###
            deferred = $q.defer()
            id = id + 1
            payload =
                jsonrpc: "2.0"
                id: id
                method: "call"
                params: options

            $http(
                method: "POST"
                url: defaults.url
                data: payload
            ).success((data, status) ->
                #$log.debug("success", data)
                result = (if data.id is id then data.result or data.error else null)
                result.id = data.id
                deferred.resolve result
            ).error (reason, status) ->
                #$log.debug("error", reason)
                deferred.reject reason
                

            deferred.promise
]
