"use strict";

//uglifyjs services.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("service.sessionService", []).factory("sessionService", function() {
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
});