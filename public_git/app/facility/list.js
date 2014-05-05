"use strict";

// uglifyjs list.js -b  --comments all 
/**
 * FacilityListCtrl
 * view of engity list
 * save pagination and filter params in session?
 */
function FacilityListCtrl($scope, $http, sessionService, common) {
    // global
    var DEFAULT_SORT_ICON = "";
    var SORT_UP_ICON = "chevron-up";
    var SORT_DOWN_ICON = "chevron-down";
    var DEFAULT_PAGE_SIZE = 15;
    //global context
    // g?
    //local context
    var context = {
        user: "idea",
        languageid: "1033",
        session: "sess"
    };
    /*
    init    
    */
    $scope.init = function() {
        $scope.session = sessionService.get("FACILITY");
        
        /*
        $scope.view_params = sessionService.get("FACILITY_VIEW");
        common.elog("currentPage:"+$scope.view_params.currentPage);
        if ($scope.view_params.currentPage === undefined)
        {
                    common.elog("else");
                $scope.view_params = {
                currentPage: 1,
                sort_col_seq: 1,
                sort_dir: "asc"
            };
            sessionService.put("FACILITY_VIEW", $scope.view_params);
        }
        
        common.elog($scope.view_params);
        */
        
        $scope.domain = null;
        $scope.filter = '';
        
        $scope.currentPage = 1;//$scope.view_params.currentPage;
        $scope.sort_col_seq = 1;//$scope.view_params.sort_col_seq;
        $scope.sort_dir = "asc";//$scope.view_params.sort_dir;
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
        $scope.pagesize = [ 2, 10, 15, 20, 30, 50, 100 ];
        $scope.table = "facility";
        $scope.cols = [ "facility", "texths", "createdon", "seq", "id" ];
        $scope.sort_icons = {};
        //$scope.bigTotalItems = 80;
        // $scope.currentPage = 1;
        //$scope.totalItems = 35;
        //$scope.currentPage = 1;
        $scope.maxSize = 10;
        // sort 
        //default sort column
        //   $scope.sort_col_seq = 1;
        // default sort dir
        //    $scope.sort_dir = "asc";
        var i;
        for (i = 1; i <= $scope.cols.length; i++) {
            $scope.sort_icons[i] = DEFAULT_SORT_ICON;
        }
        //$scope.sort_icons[col_seq] = 
        //
        //
        $scope.post();
    };
    // <-- init end
    /*       
    on_limit_change
    */
    $scope.change_limit = function() {
        common.elog("change_limit");
        context.limit = $scope.limit;
        sessionService.put("FACILITY", context);
        $scope.post();
    };
    /*
    on filter change
    */
    $scope.filter_change = function(t){
        
        if ( t == 0){
        
            if ($scope.filter == ''){
                common.elog("return");
                return;
                }
        $scope.filter = '';
        $scope.domain = null;// [[[]]];
        }else{
             $scope.domain = [[["facility","ilike",$scope.filter+"%"]],[["texths","ilike",$scope.filter+"%"]]];
            }
        $scope.post();
        
    };
    
    /*
     on_page_change
     */
    $scope.page_changed = function(page) {
        common.elog("page_changed");
        $scope.currentPage = page;
        //$scope.view_params.currentPage = $scope.currentPage;
        //sessionService.put("FACILITY_VIEW", $scope.view_params);
        //common.elog(page);
        $scope.post();
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
       // $scope.view_params.sort_col_seq = $scope.sort_col_seq;
        //$scope.view_params.sort_dir = $scope.sort_dir;
       // sessionService.put("FACILITY_VIEW", $scope.view_params);
        $scope.post();
    };
    // <-- sort end
    /*
        construct jsonrpc call in service, if switch to other web service 
        provider, just modify the service lay
      */
    $scope.post = function() {
        common.elog("post");
        // construct jsonrpc params
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
            method: "call",
            params: {
                method: "mtp_search_cf4",
                table: $scope.table,
                cols: $scope.cols,
                orderby: [ $scope.sort_col_seq, $scope.sort_dir ].join(" "),
                offset: $scope.limit * ($scope.currentPage - 1),
                domain:$scope.domain,
                limit: $scope.limit,
                languageid: "1033"
            }
        };
        // ajax call, move into service?
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            common.elog(data);
            common.elog(status);
            // rows
            $scope.facility_list = data.result.rows;
            // pagination data
            $scope.totalItems = data.result.total;
        }).error(function(data, status) {
            common.elog("Error", data);
            common.elog(status);
        });
    };
    // <- post end
    // initialize
    $scope.init();

}

// <- Controller End
FacilityListCtrl.$inject = [ "$scope", "$http", "sessionService", "common" ];