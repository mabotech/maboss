"use strict";

//uglifyjs entity.js -b  --comments all 
/**
  *Entity  Services 
  */
angular.module("service.entity", []).factory("entity", [ "$q", "$http", function($q, $http) {
    // jsonrpc id
    var ID = 0;
    //methods
    return {
        /*
            * get  value - text for select 2
            */
        getkv: function(params) {
            ID = ID + 1;
        },
        /*
            *   get value - text  on demand for select 2
            */
        getkv2: function(params) {
            ID = ID + 1;
        },
        /*
            * save
            */
        save: function(params) {
            ID = ID + 1;
            //defer
            var deferred = $q.defer();
            //jsonrpc payload
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: ID,
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
                    console.log("");
                }
                deferred.resolve(data);
                //show success msg
                console.log("");
            }).error(function(reason, status) {
                deferred.reject(reason);
                //show error msg
                console.log("");
            });
            return deferred.promise;
        },
        // <- end save()
        /**
        * delete
        */
        del: function(params) {
            var deferred = $q.defer();
            return deferred.promise;
        },
        // <- end delete
        /**
            * get
            */
        get: function(params) {
            var deferred = $q.defer();
            return deferred.promise;
        },
        // <- end delete
        /**
            * list
            */
        list: function(params) {
            ID = ID + 1;
            var deferred = $q.defer();
            // method
            params.method = "mtp_search_cf4";
            //construct jsonrpc msg
            var jsonrpc_params = {
                jsonrpc: "2.0",
                id: ID,
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