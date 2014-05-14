"use strict";

//uglifyjs fcall.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("service.fcall", []).factory("fcall", [ "$q", "$http", "common", function($q, $http, common) {
    //return {
    //   call: function() {
    //function
    var call = function(params) {
        //defer
        var deferred = $q.defer();
        //jsonrpc payload
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
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
        //elog($scope.jsonrpc_params);
        // $scope.params = JSON.stringify($scope.jsonrpc_params,null, 4)
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
    };
} ]);