# uglifyjs table.js -b  --comments all 
###
FacilityListCtrl
view of engity list
save pagination and filter params in session?
###

#function FacilityListCtrl($scope, $routeParams, $http,  sessionService, entity, common) {
angular.module("maboss.FacilityTableCtrl", [])
.controller "FacilityTableCtrl", [
    "$scope"
    "$routeParams"
    "$http"
    "sessionService"
    "dataService"
    "common"
    ($scope, $routeParams, $http, sessionService, dataService, common) ->
        
        #table name
        $scope.table = "facility"
        
        #primary key
        $scope.pkey = "facility"
        
        #configuration for datatables 
        _t = (msgid) ->
            "更新时间"

        $scope.columns = [
            {
                data: "facility"
                title: "Facility Code"
                render: (data, type, row) ->
                    "<a href=\"#/facility.form/" + data + "\">" + data + "</a>"
            }
            {
                data: "texths"
                title: "Facility"
            }
            {
                data: "company"
                orderable: false
                title: "公司"
                name: "company"
            }
            {
                data: "modifiedon"
                title: _t("modifiedon")
            }
            {
                data: "createdon"
                title: "Created On"
            }
            {
                data: "createdby"
                title: "Created By"
                orderable: false
            }
        ]
        
        #
        #     call service
        #    
        list = (data, callback) ->
            cols = []
            i = undefined
            i = 0
            while i < data.columns.length
                cols.push data.columns[i].data
                i++
            
            # construct jsonrpc params
            params =
                table: $scope.table
                pkey: $scope.pkey
                cols: cols
                orderby: [
                    parseInt(data.order[0].column) + 1
                    data.order[0].dir
                ].join(" ")
                offset: data.start
                domain: [[[
                    cols[0]
                    "ilike"
                    data.search.value + "%"
                ]]]
                limit: data.length
                
                #hardcode
                languageid: "1033"

            dataService.list(params).then ((result) ->
                rdata =
                    data: result.data
                    recordsTotal: result.total
                    recordsFiltered: result.count

                callback rdata
                return
            ), (result) ->
                rdata = data: []
                callback rdata
                return

            return

        
        #
        #    table config
        #    
        $("#main_table").dataTable
            
            #"processing": true,
            serverSide: true
            
            #data:get_data(),
            aaSorting: [[
                0
                "desc"
            ]]
            sPaginationType: "bootstrap"
            oLanguage:
                sSearch: "Search"
                sLengthMenu: "_MENU_"

            ajax: (data, callback, setting) ->
                list data, callback
                return

            columns: $scope.columns
            columnDefs:
                render: (data, type, row) ->
                    data + " (" + row[3] + ")"

]
