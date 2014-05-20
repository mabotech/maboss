"use strict";

//  jsonrpc client
//uglifyjs jsonrpc.js -b  --comments all 
angular.module("service.jsonrpc", []).factory("jsonrpc", [ "$q", "$http", "$log", function($q, $http, $log) {
    var defaults = this.defaults = {};
    var deferred = $q.defer();
    var rpc_id = 0;
    defaults.basePath = "/rpc";
    return {
        call: function(options) {
            rpc_id = rpc_id + 1;
            var payload = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: options.params
            };
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: payload
            }).success(function(data, status) {
                var result = [];
                if (data.result.rows) {
                    result = data.result.rows;
                    deferred.resolve(result);
                }
            }).error(function(reason, status) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }
    };
} ]);