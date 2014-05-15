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
    $scope.table = "facility";
    $scope.pkey = "fac";
    /*
    var get_data = function(){
        
        
        return [{"facility":"f2","texths":"f22","company":null,"createdon":"2014-05-14T09:38:32.714Z","createdby":"idea"},{"facility":"fc","texths":"fcc","company":null,"createdon":"2014-05-13T21:45:00.885Z","createdby":"idea"}];
        
        }
    */
    var table = $("#facility").dataTable({
        //"processing": true,
        serverSide: true,
        //data:get_data(),
        aaSorting: [ [ 0, "desc" ] ],
        sPaginationType: "bootstrap",
        oLanguage: {
            sSearch: "Search",
            sLengthMenu: "_MENU_"
        },
        ajax: {
            url: "/api/datatables.call",
            //"type":"POST",
            //"contentType":"application/json; charset=UTF-8", 
            data: function(d) {
                d.table = $scope.table;
                d.pkey = $scope.pkey;
                d.method = "mtp_search_cf4";
            }
        },
        columns: [ {
            data: "facility"
        }, {
            data: "texths"
        }, {
            data: "company"
        }, {
            data: "createdon"
        }, {
            data: "createdby"
        } ]
    });
} ]);