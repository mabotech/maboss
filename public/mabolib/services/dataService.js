"use strict";

//uglifyjs dataService.js -b  --comments all 
/**
  *Data  Services
  */
angular.module("service.dataService", []).factory("dataService", [ "$q", "$http", "$log", function($q, $http, $log) {
    // jsonrpc id
    var rpc_id = 0;
    //methods
    return {
        /*
            * get  value - text for select 2
            */
        getkv: function(params) {
            rpc_id = rpc_id + 1;
            var deferred = $q.defer();
            params.method = "mtp_select_cf2";
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: {
                    method: params.method,
                    table: params.table,
                    key: params.key,
                    value: params.text,
                    languageid: params.languageid
                }
            };
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: jsonrpc_params
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
        },
        /*
            *   get value - text  on demand for select 2
            */
        getkv2: function(params) {
            rpc_id = rpc_id + 1;
            var deferred = $q.defer();
        },
        /*
            * save
            */
        save: function(params) {
            rpc_id = rpc_id + 1;
            //defer
            var deferred = $q.defer();
            //jsonrpc payload
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: {
                    // insert or update
                    method: "mtp_upsert_cs8",
                    //table name
                    table: params.table,
                    //primary key
                    pkey: params.pkey,
                    //columns
                    columns: params.model,
                    context: {
                        user: params.user,
                        languageid: params.languageid
                    }
                }
            };
            // call ajax
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: jsonrpc_params
            }).success(function(data, status) {
                //$scope.data =  JSON.stringify(data, null, 4);
                if (data.result.returning.length === 0) {
                    //data = [];
                    // reject
                    deferred.reject("no data");
                    //show error msg
                    //Message.post();
                    //console.log();
                    //debug.error("msg");
                    $log.debug("no data");
                }
                deferred.resolve(data);
                //show success msg
                $log.debug("success");
            }).error(function(reason, status) {
                deferred.reject(reason);
                //show error msg
                $log.error(reason);
            });
            return deferred.promise;
        },
        // <- end save()
        /**
            * delete
            */
        del: function(params) {
            rpc_id = rpc_id + 1;
            var deferred = $q.defer();
            params.method = "mtp_delete_cf2";
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: {
                    method: params.method,
                    table: params.table,
                    ids: params.ids,
                    user: "system"
                }
            };
            // ajax call, move into service?
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: jsonrpc_params
            }).success(function(data, status) {
                var result = {};
                deferred.resolve(result);
            }).error(function(reason, status) {
                deferred.reject(reason);
            });
            return deferred.promise;
        },
        // <- end delete
        /**
            * get
            */
        get: function(params) {
            rpc_id = rpc_id + 1;
            var deferred = $q.defer();
            params.method = "mtp_fetch_one_cf1";
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: {
                    method: params.method,
                    table: params.table,
                    //eneity
                    pkey: params.pkey,
                    cols: Object.keys(params.model),
                    languageid: params.languageid,
                    context: {
                        user: "idea",
                        languageid: "1033"
                    }
                }
            };
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: jsonrpc_params
            }).success(function(data, status) {
                if (data.result.returning.length === 0) {}
                var result = {};
                deferred.resolve(result);
            }).error(function(reason, status) {
                deferred.reject(reason);
            });
            return deferred.promise;
        },
        // <- end delete
        /**
            * fetch
            */
        fetch: function(params) {
            rpc_id = rpc_id + 1;
            var deferred = $q.defer();
            // method
            params.method = "mtp_search_cf4";
            //construct jsonrpc msg
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: rpc_id,
                method: "call",
                params: params
            };
            // call ajax
            $http({
                method: "POST",
                url: "/api/callproc.call",
                data: jsonrpc_params
            }).success(function(data, status) {
                var result = {};
                
                result.data = data.result.rows;
                result.total = data.result.total;
                result.count = data.result.count;
                //resolve
                deferred.resolve(result);
            }).error(function(reason, status) {
                //reject
                deferred.reject(reason);
            });
            // <-- end ajax call
            return deferred.promise;
        }
    };
} ]);