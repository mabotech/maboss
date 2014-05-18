"use strict";

// uglifyjs form.js -b  --comments all 
/**
* Company Controllers
* Copyright
* License MIT
*/
/**
* CompanyFormCtrl
* view of entity form
*  Create or update
* @params
*/
function FacilityFormCtrl($scope, $routeParams, $location, $http, sessionService, common) {
    /**
* @init
*   Initialize
*/
    $scope.init = function() {
        //check auth
        if (common.auth()) {} else {}
        $scope.table = "facility";
        $scope.facility_id = $routeParams.id;
        /*
Model defination
*/
        $scope.facility = {
            //id: null,
            //seq: null,
            facility: null,
            texths: null,
            company: null,
            purchasingorganization: null,
            /*
codesystemtype: null,
domainmanagerid: null,
formattype: null,
objectclass: null,
*/
            modifiedon: null,
            modifiedby: null,
            createdon: null,
            createdby: null,
            rowversion: null
        };
        //get company for select2
        //$scope.get_company();
        $scope.get_purchasingorganization();
        if ($scope.facility_id === undefined) {
            common.elog("new/insert");
        } else {
            common.elog($scope.facility_id);
            $scope.get();
        }
    };
    /*    
Purchasingorganization  selection
*/
    /*
$scope.purchasingorganization = [ {
id: "CCI",
text: "C-C-I"
}, {
id: "MT",
text: "M-T"
} ];
*/
    $scope.get_purchasingorganization = function() {
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
            method: "call",
            params: {
                method: "mtp_select_cf2",
                table: "company",
                key: "company",
                value: "texths",
                languageid: "1033"
            }
        };
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            if (data.result.rows) {
                $scope.purchasingorganization = data.result.rows;
            } else {
                $scope.purchasingorganization = [];
            }
        }).error(function(data, status) {});
    };
    $scope.purchasingorganization_sel = {
        placeholder: "Purchasing organization"
    };
    /*
Company selection
*/
    $scope.company_sel = {
        placeholder: "选择Company",
        //minimumInputLength: 1,
        allowClear: true,
        initSelection: function(el, fn) {
            fn({
                id: $scope.facility.company,
                text: $scope.facility.company
            });
        },
        ajax: {
            url: "/api/callproc.call",
            dataType: "json",
            type: "POST",
            params: {
                contentType: "application/json; charset=utf-8"
            },
            //transport:getdata,
            data: function(term, page) {
                var json_data = {
                    jsonrpc: "2.0",
                    id: common.getId(),
                    method: "call",
                    params: {
                        method: "mtp_select_cf2",
                        table: "company",
                        key: "company",
                        value: "texths",
                        languageid: "1033",
                        filter: term
                    }
                };
                return JSON.stringify(json_data);
            },
            results: function(data, page) {
                var rtn = [];
                if (data.result.rows) {
                    rtn = data.result.rows;
                }
                //else error:no data
                return {
                    results: rtn
                };
            }
        }
    };
    // $scope.facility -> $scope.t_facility || $scope.obj ?
    // entity
    /**
* @save
*/
    $scope.save = function() {
        $scope.post();
    };
    /**
* @refresh
*/
    $scope.refresh = function() {
        $scope.get();
    };
    $scope.validate = function() {};
    /**
* @post
*/
    $scope.post = function() {
        common.elog("post");
        common.elog($scope.facility.texths);
        //
        $scope.facility.company = $scope.facility.company.company;
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
            method: "call",
            params: {
                method: "mtp_upsert_cs8",
                table: $scope.table,
                pkey: "facility",
                //eneity
                columns: $scope.facility,
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        common.elog(jsonrpc_params);
        // call ajax
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            common.elog(data);
            $scope.data = data;
            if (data.result.returning.length === 0) {
                common.elog("returning error");
                return 0;
            }
            // fill entity
            $scope.facility.facility = data.result.returning[0].facility;
            //$scope.facility.seq = data.result.returning[0].seq;
            $scope.facility.modifiedon = data.result.returning[0].modifiedon;
            $scope.facility.modifiedby = data.result.returning[0].modifiedby;
            $scope.facility.createdon = data.result.returning[0].createdon;
            $scope.facility.createdby = data.result.returning[0].createdby;
            $scope.facility.rowversion = data.result.returning[0].rowversion;
            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
            common.elog("Error");
            common.elog(data);
        });
    };
    // <- end post
    /**
* @get
*/
    $scope.get = function() {
        common.elog("post");
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: common.getId(),
            method: "call",
            params: {
                method: "mtp_get_cs3",
                table: $scope.table,
                //eneity
                pkey: "facility",
                id: $scope.facility_id,
                cols: Object.keys($scope.facility),
                languageid: "1033",
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        common.elog(jsonrpc_params);
        // call ajax
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            common.elog(data);
            $scope.data = data;
            if (data.result.returning.length === 0) {
                common.elog("returning error");
                return 0;
            }
            // fill entity
            $scope.facility = data.result.returning[0];
            common.elog($scope.facility);
            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
            common.elog("Error");
            common.elog(data);
        });
    };
    // <- get end
    $scope.init();
}

// <- End controller
FacilityFormCtrl.$inject = [ "$scope", "$routeParams", "$location", "$http", "sessionService", "common" ];