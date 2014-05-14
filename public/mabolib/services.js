"use strict";

//uglifyjs services.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("maboss.services", []).factory("auth", function() {
    return {
        check: function() {
            return true;
        }
    };
}).factory("storageService", function() {
    //localStorage
    //var STORAGE_ID = 'blockSettings';
    return {
        get: function(key) {
            return JSON.parse(localStorage.getItem(key) || "[]");
        },
        put: function(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        },
        remove: function(key) {
            localStorage.removeItem(key);
        }
    };
}).factory("sessionService", function() {
    //sessionStorage
    //var STORAGE_ID = 'sessionStorage';
    return {
        get: function(key) {
            return JSON.parse(sessionStorage.getItem(key) || "{}");
        },
        put: function(key, val) {
            sessionStorage.setItem(key, JSON.stringify(val));
        },
        remove: function(key) {
            sessionStorage.removeItem(key);
        }
    };
}).factory("common", function() {
    //utils, helpers
    var ID = 0;
    
    var MID = 0;
    
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air'
}
    
    return {
        elog: function(message) {
            console.log(message);
        },
        
        post:function(level, message){
            MID = MID +1;
            
            //var dt = new Date();
            
            if (level == 'info'){
                Messenger().post({
                    message:  "[ "+MID+" ] &nbsp;&nbsp;&nbsp;"+message,
                    type: 'info',
                    hideAfter:2
                    //showCloseButton: true
                });
            }else if (level == 'error'){
                      Messenger().post({
                    message:message,
                    type: 'error',
                    showCloseButton: true
                });          
                }
            
            },
        
        getId: function() {
            ID = ID + 1;
            return "r" + ID;
        },
        auth: function() {
            return true;
        }
    };
})
.factory("callproc", function($http, common)
{
    
    return{
        
        call:function(method, params, callback){
            
        var  jsonrpc_params = {
            jsonrpc: "2.0",
            id:  common.getId(),
            method: "call",
            params: {
                method: "mtp_upsert_cs8",
                table: params.table,
                pkey:params.pkey,
                columns: params.model,
                context: {
                    user: params.user,
                    languageid: parmas.languageid
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
        
            $scope.data =  JSON.stringify(data, null, 4);
            if (data.result.returning.length === 0) {
             
                return 0;
            }

            callback(result);
            
        }).error(function(data, status) {

        });
            
            }
        
        }
    
    }

)

.factory("initSelect2", function($http, common){
    
return{
    
    get:function(method, params, callback){
        
        var id = 10;
        
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
            method: "call",
            params: {
                method: "mtp_select_cf2",
                table: params.table,
                key: params.pkey,
                value: params.ptext,
                languageid: params.languageid
                //filter: term
            }
        };
        
        var result = [];
        
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            if (data.result.rows) {
                result = data.result.rows;
            } 
            
            callback(result);
            
        }).error(function(data, status) {
            
            
            // post msg
            
            });
        
        
        }
    
    }    
    
})
.factory("webService", function($http) {
    //webService
    var ID = 0;
    return {
        //post
        post: function(method, params, successCallback) {
            //var d = $q.defer();
            ID = ID + 1;
            var bodyRequest = JSON.stringify({
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: "MT" + ID
            });
            var headers = {
                "Content-Type": "application/json"
            };
            $http({
                url: "/api",
                method: "POST",
                data: bodyRequest,
                headers: headers
            }).success(function(data, status, headers, config) {
                return successCallback(data, status, headers, config);
            }).error(function(data, status, headers, config) {
                return successCallback(data, status, headers, config);
            });
        }
    };
});