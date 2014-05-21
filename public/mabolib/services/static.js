"use strict";

//uglifyjs entity.js -b  --comments all 
/**
  *Entity  Services 
  */
angular.module("service.static", []).factory("static", [ "$q", "$http", function($q, $http) {
    // global static
    return {
        ID:1,
        Name:"maboss",
        GET:"",
        SAVE:"",
        DEL:"",
        UPSERT:"mtp_upsert_cs8"
    }
} ]);