###
FacilityTableCtrl
###


angular.module "maboss.FacilityTableCtrl", []

.controller "FacilityTableCtrl",
[ "$scope", "$routeParams", "$http", "sessionService",
"dataService", "common",
($scope, $routeParams, $http, sessionService, dataService, common)  ->


    #//table name
    $scope.table = "facility"
    #//primary key
    $scope.pkey = "facility"
    #//configuration for datatables
    
    _t = (msgid) ->
        
        return "更新时间"
        
        
    $scope.columns = [ {
        data: "facility"
        title: "Facility Code"
        render:  ( data, type, row ) ->
                    return  '<a href="#/facility.form/'+data +'">'+data+'</a>'
                
    }, {
        data: "texths"
        title: "Facility"
    }, {
        data: "company"
        orderable: false
        title: "公司"
        name: "company"
    },{
        data: "modifiedon"
        title: _t('modifiedon')
    },
        

    {
        data: "createdon"
        title: "Created On"
    }, {
        data: "createdby"
        title: "Created By"
        orderable: false
    } ]
    ###
     call service
    ###
    list = (data, callback) ->
        cols = []
        #var i;
        for val in data.columns
            cols.push(val.data)
        
        #// construct jsonrpc params
        params = {
            table: $scope.table
            pkey: $scope.pkey
            cols: cols
            orderby: [ parseInt(data.order[0].column) + 1
                data.order[0].dir ].join(" ")
            offset: data.start
            domain: [ [ [ cols[0], "ilike", data.search.value + "%" ] ] ]
            limit: data.length
            #//hardcode
            languageid: "1033"
        }
        dataService.list(params).then((result) ->
            rdata = {
                data: result.data
                recordsTotal: result.total
                recordsFiltered: result.count
            }
            callback(rdata)
        , (result) ->
            rdata = {
                data: []
            }
            callback(rdata)
        )
    
    ###
    table config
    ###
    $("#main_table").dataTable({
        #//"processing": true,
        serverSide: true
        #//data:get_data(),
        aaSorting: [ [ 0, "desc" ] ]
        sPaginationType: "bootstrap"
        oLanguage:
            sSearch: "Search"
            sLengthMenu: "_MENU_"
        
        ajax: (data, callback, setting) ->
            list(data, callback)
        columns: $scope.columns
        columnDefs:
            render: ( data, type, row ) ->
                    return data +' ('+ row[3]+')'
        
    })
]