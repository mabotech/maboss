"use strict"

#  jsonrpc client
#  uglifyjs jsonrpc.js -b  --comments all 
angular.module("service.jsonrpc", []).factory "jsonrpc", [
    "$q"
    "$http"
    "$log"
    ($q, $http, $log) ->
        defaults = @defaults = {}
        
        id = 0
        defaults.basePath = "/rpc"
        #return service
        return call: (options) ->
            ###
            deferred must be declared inside
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
                url: "/api/callproc.call"
                data: payload
            ).success((data, status) ->
                #result = []
                #if json_rpc_result.result.data
                #    result = json_rpc_result.result.data
                #    deferred.resolve result
                $log.debug("success", data)
                result = (if data.id is id then data.result or data.error else null)
                result.id = data.id
                deferred.resolve result
            ).error (reason, status) ->
                $log.debug("error", reason)
                deferred.reject reason
                

            deferred.promise
]
