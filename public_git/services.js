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
    return {
        elog: function(msg) {
            console.log(msg);
        },
        getId: function() {
            ID = ID + 1;
            return "r" + ID;
        },
        auth: function() {
            return true;
        }
    };
}).factory("webService", function($http) {
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