"use strict";

// uglifyjs list.js -b  --comments all 
/**
 * FacilityListCtrl
 * view of engity list
 * save pagination and filter params in session?
 */
//function FacilityListCtrl($scope, $routeParams, $http,  sessionService, entity, common) {
var module = angular.module("maboss.FacilityTableCtrl", []);

module.controller("FacilityTableCtrl", [ "$scope", "$routeParams", "$http", "sessionService", "dataService", "common", function($scope, $routeParams, $http, sessionService, dataService, common) {

    /*
        $('#example').dataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "/poc/app/data.js",
        "columns": [
            { "data": "first_name" },
            { "data": "last_name" },
            { "data": "position" },
            { "data": "office" },
            { "data": "start_date" },
            { "data": "salary" }
        ]
    } );
    */
} ]);