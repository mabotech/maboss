"use strict";

// uglifyjs list.js -b  --comments all 
/**
 * FacilityListCtrl
 * view of engity list
 * save pagination and filter params in session?
 */
//function FacilityListCtrl($scope, $routeParams, $http,  sessionService, entity, common) {
var module = angular.module("maboss.FacilityListCtrl", []);

module.controller("FacilityListCtrl", [ "$scope", "$routeParams", "$http", "sessionService", "dataService", "common", function($scope, $routeParams, $http, sessionService, dataService, common) {
    $scope.table = "facility";
    // columns in html table
    $scope.cols = [ "facility", "texths", "createdon", "createdby" ];
    // global
    var DEFAULT_SORT_ICON = "";
    var SORT_UP_ICON = "chevron-up";
    var SORT_DOWN_ICON = "chevron-down";
    var DEFAULT_PAGE_SIZE = 15;
    var filter = $routeParams.filter;
    $scope.limitOptions = {};
    // filter in url
    if (filter) {
        //facility list with given company
        $scope.domain = [ [ [ "company", "=", "MTP" ] ] ];
        $scope.list();
    }
    //global context
    // g?
    //local context
    var context = {
        user: "idea",
        languageid: "1033",
        session: "sess"
    };
    /*
    initialize ctrl
    */
    $scope.init = function() {
        $scope.session = sessionService.get("FACILITY");
        $scope.domain = null;
        if ($scope.session.user === undefined) {
            sessionService.put("FACILITY", context);
        } else {
            common.elog($scope.session);
        }
        if ($scope.session.limit) {
            $scope.limit = $scope.session.limit;
        } else {
            $scope.limit = DEFAULT_PAGE_SIZE;
        }
        init_table();
        $scope.list();
    };
    // <-- init end
    //----------------------------------------------------
    /*
    * initial table
    */
    var init_table = function() {
        $scope.filter = "";
        $scope.currentPage = 1;
        //$scope.view_params.currentPage;
        $scope.sort_col_seq = 1;
        //$scope.view_params.sort_col_seq;
        $scope.sort_dir = "asc";
        //$scope.view_params.sort_dir;
        $scope.pagesize = [ 15, 20, 30, 50, 100 ];
        $scope.sort_icons = {};
        $scope.maxSize = 10;
        var i;
        for (i = 1; i <= $scope.cols.length; i++) {
            $scope.sort_icons[i] = DEFAULT_SORT_ICON;
        }
    };
    /*       
    on_limit_change
    */
    $scope.change_limit = function() {
        common.elog("change_limit");
        context.limit = $scope.limit;
        sessionService.put("FACILITY", context);
        $scope.list();
    };
    /*
    on filter change
    */
    $scope.filter_change = function(t) {
        if (t === 0) {
            if ($scope.filter === "") {
                common.elog("return");
                return;
            }
            $scope.filter = "";
            $scope.domain = null;
        } else {
            $scope.domain = [ [ [ "facility", "ilike", $scope.filter + "%" ] ], [ [ "texths", "ilike", $scope.filter + "%" ] ] ];
        }
        $scope.list();
    };
    /*
     on_page_change
     */
    $scope.page_changed = function(page) {
        common.elog("page_changed");
        $scope.currentPage = page;
        $scope.list();
    };
    /*
       * ng-class
    */
    $scope.get_icon = function(seq) {
        if ($scope.sort_icons[seq] !== "") {
            return [ "fa fa", $scope.sort_icons[seq] ].join("-");
        } else {
            return "fa";
        }
    };
    /*
     orderby
     */
    $scope.sort = function(col_seq) {
        if ($scope.sort_col_seq == col_seq) {
            if ($scope.sort_dir == "asc") {
                $scope.sort_dir = "desc";
                $scope.sort_icons[col_seq] = SORT_DOWN_ICON;
            } else {
                $scope.sort_dir = "asc";
                $scope.sort_icons[col_seq] = SORT_UP_ICON;
            }
        } else {
            $scope.sort_icons[$scope.sort_col_seq] = DEFAULT_SORT_ICON;
            $scope.sort_col_seq = col_seq;
            $scope.sort_dir = "asc";
            $scope.sort_icons[col_seq] = SORT_UP_ICON;
        }
        $scope.list();
    };
    // <-- sort end
    //----------------------------------------------------
    /*
        construct jsonrpc call in service, if switch to other web service 
        provider, just modify the service lay
      */
    $scope.list = function() {
        common.elog("post");
        // construct jsonrpc params
        var params = {
            table: $scope.table,
            pkey: "facility",
            cols: $scope.cols,
            orderby: [ $scope.sort_col_seq, $scope.sort_dir ].join(" "),
            offset: $scope.limit * ($scope.currentPage - 1),
            domain: $scope.domain,
            limit: $scope.limit,
            languageid: "1033"
        };
        dataService.list(params).then(function(result) {
            //common.elog(data);
            $scope.facility_list = result.data;
            // data.result.rows;
            // pagination data
            $scope.totalItems = result.total;
        }, function(result) {
            common.elog(result);
        });
    };
    // <- post end
    // initialize
    $scope.init();
} ]);