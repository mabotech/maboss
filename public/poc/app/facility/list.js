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
    //hardcode
    $scope.table = "facility";
    // columns in html table
    //hardcode
    $scope.cols = [ "facility", "texths", "createdon", "createdby" ];
    // global
    var DEFAULT_SORT_ICON = "";
    var DEFAULT_DIR = "asc";
    //var SORT_UP_ICON = "chevron-up";
    //var SORT_DOWN_ICON = "chevron-down";
    
    var SORT_ICON = {'asc':'chevron-up', 'desc':'chevron-down'}
    
    var DEFAULT_PAGE_SIZE = 15;
    
    $scope.limitOptions = {};
        

    //global context
    // g?
    //local context
    //hardcode
    var context = {
        user: "idea",
        languageid: "1033",
        session: "sess"
    };
    /*
    initialize ctrl
    */
    var init = function() {
        //hardcode
        $scope.session = sessionService.get("FACILITY");
        $scope.domain = null;
        if ($scope.session.user === undefined) {
            //hardcode
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
        
        var filter = $routeParams.filter;
    // filter in url
        if (filter) {
            //facility list with given company
            //hardcode
            $scope.domain = [ [ [ "company", "=", "MTP" ] ] ];
          //  list();
        }
        //get data
       list();
    };
    // <-- init end
    //----------------------------------------------------
    /*
     initial variables for table(filter, sort, pagination)
    */
    var init_table = function() {
        $scope.filter = "";
        $scope.currentPage = 1;
        //$scope.view_params.currentPage;
        $scope.sort_col_seq = 1;
        //$scope.view_params.sort_col_seq;
        $scope.sort_dir = "";
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
    on_limit_change, save configuraton into session.
    user level or table level ?
    */
    $scope.change_limit = function() {
        common.elog("change_limit");
        context.limit = $scope.limit;
        //hardcode
        sessionService.put("FACILITY", context);
        list();
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
            // hardcode
            $scope.domain = [ [ [ "facility", "ilike", $scope.filter + "%" ] ], [ [ "texths", "ilike", $scope.filter + "%" ] ] ];
        }
       list();
    };
    /*
     on_page_change
     */
    $scope.page_changed = function(page) {
        common.elog("page_changed");
        $scope.currentPage = page;
        list();
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
      order by,  table view
     */
    $scope.sort = function(col_seq) {
        if ($scope.sort_col_seq == col_seq) {
            if ($scope.sort_dir == "asc") {
                $scope.sort_dir = "desc";               
            } else if($scope.sort_dir == "desc"){
                $scope.sort_dir = "asc";
            //    $scope.sort_icons[col_seq] = SORT_UP_ICON;
            }else{
                $scope.sort_dir = DEFAULT_DIR;
            //    $scope.sort_icons[col_seq] = DEFAULT_ICON_DIR;
            }
        } else {
            $scope.sort_icons[$scope.sort_col_seq] = DEFAULT_SORT_ICON;
            $scope.sort_col_seq = col_seq;
            $scope.sort_dir = DEFAULT_DIR;
          //  $scope.sort_icons[col_seq] = SORT_UP_ICON;
        }
         $scope.sort_icons[col_seq] = SORT_ICON[$scope.sort_dir];
        list();
    };
    // <-- End sort
    //----------------------------------------------------
    /*
        construct jsonrpc call in service, if switch to other web service 
        provider, just modify the service lay
      */
    var list = function() {
        // construct jsonrpc params
        var params = {
            table: $scope.table,
            //hardcode
            pkey: "facility",
            cols: $scope.cols,
            orderby: [ $scope.sort_col_seq, $scope.sort_dir ].join(" "),
            offset: $scope.limit * ($scope.currentPage - 1),
            domain: $scope.domain,
            limit: $scope.limit,
            //hardcode
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
    // <- End list
    // initialize controller
    init();
} ]);