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
    
     $scope.table ="facility";
    $scope.pkey = "fac";
 //$(document).ready(function() {
    var table = $('#facility').dataTable( {
        "processing": true,
        "serverSide": true,
        "ajax":{
            "url": "/api/datatables.call",
            //"type":"POST",
            //"contentType":"application/json; charset=UTF-8", 
              "data": function ( d ) {
                d.table = $scope.table;
                d.pkey  =$scope.pkey;
                d.method = 'mtp_search_cf4';
                // d.custom = $('#myInput').val();
                // etc
            }
        },
        "columns": [
            { "data": "facility" },
            { "data": "texths" },
            { "data": "company" },
            { "data": "createdon" },
            { "data": "createdby" }

        ]
    } );
//} );
} ]);