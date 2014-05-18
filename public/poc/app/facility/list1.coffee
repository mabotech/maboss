"use strict"

# uglifyjs list.js -b  --comments all 
###
FacilityListCtrl
view of engity list
save pagination and filter params in session?
###

#function FacilityListCtrl($scope, $routeParams, $http,  sessionService, entity, common) {
module = angular.module("maboss.FacilityListCtrl", [])
module.controller "FacilityListCtrl", [
    "$scope"
    "$routeParams"
    "$http"
    "sessionService"
    "dataService"
    "common"
    ($scope, $routeParams, $http, sessionService, dataService, common) ->
        
        #hardcode
        $scope.table = "facility"
        
        # columns in html table
        #hardcode
        $scope.cols = [
            "facility"
            "texths"
            "createdon"
            "createdby"
        ]
        
        # global
        DEFAULT_SORT_ICON = ""
        DEFAULT_DIR = "asc"
        
        #var SORT_UP_ICON = "chevron-up";
        #var SORT_DOWN_ICON = "chevron-down";
        SORT_ICON =
            asc: "chevron-up"
            desc: "chevron-down"

        DEFAULT_PAGE_SIZE = 15
        $scope.limitOptions = {}
        
        #global context
        # g?
        #local context
        #hardcode
        context =
            user: "idea"
            languageid: "1033"
            session: "sess"

        
        #
        #    initialize ctrl
        #    
        init = ->
            
            #hardcode
            $scope.session = sessionService.get("FACILITY")
            $scope.domain = null
            if $scope.session.user is `undefined`
                
                #hardcode
                sessionService.put "FACILITY", context
            else
                common.elog $scope.session
            if $scope.session.limit
                $scope.limit = $scope.session.limit
            else
                $scope.limit = DEFAULT_PAGE_SIZE
            init_table()
            filter = $routeParams.filter
            
            # filter in url
            if filter
                
                #facility list with given company
                #hardcode
                $scope.domain = [[[
                    "company"
                    "="
                    "MTP"
                ]]]
            
            #  list();
            
            #get data
            list()
            return

        
        # <-- init end
        #----------------------------------------------------
        #
        #     initial variables for table(filter, sort, pagination)
        #    
        init_table = ->
            $scope.filter = ""
            $scope.currentPage = 1
            
            #$scope.view_params.currentPage;
            $scope.sort_col_seq = 1
            
            #$scope.view_params.sort_col_seq;
            $scope.sort_dir = ""
            
            #$scope.view_params.sort_dir;
            $scope.pagesize = [
                15
                20
                30
                50
                100
            ]
            $scope.sort_icons = {}
            $scope.maxSize = 10
            i = undefined
            i = 1
            while i <= $scope.cols.length
                $scope.sort_icons[i] = DEFAULT_SORT_ICON
                i++
            return

        
        #       
        #    on_limit_change, save configuraton into session.
        #    user level or table level ?
        #    
        $scope.change_limit = ->
            common.elog "change_limit"
            context.limit = $scope.limit
            
            #hardcode
            sessionService.put "FACILITY", context
            list()
            return

        
        #
        #    on filter change
        #    
        $scope.filter_change = (t) ->
            if t is 0
                if $scope.filter is ""
                    common.elog "return"
                    return
                $scope.filter = ""
                $scope.domain = null
            else
                
                # hardcode
                $scope.domain = [
                    [[
                        "facility"
                        "ilike"
                        $scope.filter + "%"
                    ]]
                    [[
                        "texths"
                        "ilike"
                        $scope.filter + "%"
                    ]]
                ]
            list()
            return

        
        #
        #     on_page_change
        #     
        $scope.page_changed = (page) ->
            common.elog "page_changed"
            $scope.currentPage = page
            list()
            return

        
        #
        #       * ng-class
        #    
        $scope.get_icon = (seq) ->
            if $scope.sort_icons[seq] isnt ""
                [
                    "fa fa"
                    $scope.sort_icons[seq]
                ].join "-"
            else
                "fa"

        
        #
        #      order by,  table view
        #     
        $scope.sort = (col_seq) ->
            if $scope.sort_col_seq is col_seq
                if $scope.sort_dir is "asc"
                    $scope.sort_dir = "desc"
                else if $scope.sort_dir is "desc"
                    $scope.sort_dir = "asc"
                
                #    $scope.sort_icons[col_seq] = SORT_UP_ICON;
                else
                    $scope.sort_dir = DEFAULT_DIR
            
            #    $scope.sort_icons[col_seq] = DEFAULT_ICON_DIR;
            else
                $scope.sort_icons[$scope.sort_col_seq] = DEFAULT_SORT_ICON
                $scope.sort_col_seq = col_seq
                $scope.sort_dir = DEFAULT_DIR
            
            #  $scope.sort_icons[col_seq] = SORT_UP_ICON;
            $scope.sort_icons[col_seq] = SORT_ICON[$scope.sort_dir]
            list()
            return

        
        # <-- End sort
        #----------------------------------------------------
        #
        #        construct jsonrpc call in service, if switch to other web service 
        #        provider, just modify the service lay
        #      
        list = ->
            
            # construct jsonrpc params
            params =
                table: $scope.table
                
                #hardcode
                pkey: "facility"
                cols: $scope.cols
                orderby: [
                    $scope.sort_col_seq
                    $scope.sort_dir
                ].join(" ")
                offset: $scope.limit * ($scope.currentPage - 1)
                domain: $scope.domain
                limit: $scope.limit
                
                #hardcode
                languageid: "1033"

            dataService.list(params).then ((result) ->
                
                #common.elog(data);
                $scope.facility_list = result.data
                
                # data.result.rows;
                # pagination data
                $scope.totalItems = result.total
                return
            ), (result) ->
                common.elog result
                return

            return

        
        # <- End list
        # initialize controller
        init()
]
