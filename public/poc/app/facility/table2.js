"use strict";

// uglifyjs table.js -b  --comments all 
/**
 * FacilityListCtrl
 * view of engity list
 * save pagination and filter params in session?
 */
//function FacilityListCtrl($scope, $routeParams, $http,  sessionService, entity, common) {
var module = angular.module("maboss.FacilityTableCtrl", []);

module.controller("FacilityTableCtrl", [ "$scope", "$routeParams", "$http", "sessionService", "dataService", "common", function($scope, $routeParams, $http, sessionService, dataService, common) {
    //table name
    $scope.table = "facility";
    //primary key
    $scope.pkey = "facility";
    //configuration for datatables 
    $scope.columns = [ {
        data: "facility"
    }, {
        data: "texths"
    }, {
        data: "company",
        orderable: false,
        title: "公司",
        name: "company"
    }, {
        data: "createdon"
    }, {
        data: "createdby"
    } ];
    /*
     call service
    */
    var list = function(data, callback) {
        var cols = [];
        var i;
        for (i = 0; i < data.columns.length; i++) {
            cols.push(data.columns[i].data);
        }
        // construct jsonrpc params
        var params = {
            table: $scope.table,
            pkey: $scope.pkey,
            cols: cols,
            orderby: [ parseInt(data.order[0].column) + 1, data.order[0].dir ].join(" "),
            offset: data.start,
            domain: [ [ [ cols[0], "ilike", data.search.value + "%" ] ] ],
            limit: data.length,
            //hardcode
            languageid: "1033"
        };
        dataService.list(params).then(function(result) {
            var rdata = {
                data: result.data,
                recordsTotal: result.total,
                recordsFiltered: result.count
            };
            callback(rdata);
        }, function(result) {
            var rdata = {
                data: []
            };
            callback(rdata);
        });
    };
    /*
    table config
    */
    $("#facility").dataTable({
        //"processing": true,
        serverSide: true,
        //data:get_data(),
        aaSorting: [ [ 0, "desc" ] ],
        sPaginationType: "bootstrap",
        oLanguage: {
            sSearch: "Search",
            sLengthMenu: "_MENU_"
        },
        ajax: function(data, callback, setting) {
            list(data, callback);
        },
        columns: $scope.columns
    });
} ]);