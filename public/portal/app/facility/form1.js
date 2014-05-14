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
function FacilityFormCtrl($scope, $routeParams, $location, $http) {
    /**
        * @init
        *   Initialize
        */
    $scope.init = function() {
        $scope.table = "facility";
        $scope.facility_id = $routeParams.id;
        /*
        Model defination
        */
        $scope.facility = {
            id: null,
            seq: null,
            facility: "",
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
        if ($scope.facility_id === undefined) {
            elog("new/insert");
        } else {
            elog($scope.facility_id);
            $scope.get();
        }
    };
    /*    
     Purchasingorganization  selection
    */
    $scope.purchasingorganization = [ {
        id: "CCI",
        text: "C-C-I"
    }, {
        id: "MT",
        text: "M-T"
    } ];
    $scope.get_purchasingorganization = function() {
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_select_cf2",
                table: "company",
                key: "seq",
                value: "texths",
                languageid: "1033",
                filter: term
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
                    id: "r2",
                    method: "call",
                    params: {
                        method: "mtp_select_cf2",
                        table: "company",
                        key: "seq",
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
        elog("post");
        elog($scope.facility.texths);
        //
        $scope.facility.company = $scope.facility.company.id;
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_upsert_cf5",
                table: $scope.table,
                //eneity
                columns: $scope.facility,
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        elog(jsonrpc_params);
        // call ajax
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            elog(data);
            $scope.data = data;
            if (data.result.returning.length === 0) {
                elog("returning error");
                return 0;
            }
            // fill entity
            $scope.facility.id = data.result.returning[0].id;
            $scope.facility.seq = data.result.returning[0].seq;
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
            elog("Error");
            elog(data);
        });
    };
    // <- end post
    /**
        * @get
        */
    $scope.get = function() {
        elog("post");
        var jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_fetch_one_cf1",
                table: $scope.table,
                //eneity
                id: $scope.facility_id,
                cols: Object.keys($scope.facility),
                languageid: "1033",
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        elog(jsonrpc_params);
        // call ajax
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: jsonrpc_params
        }).success(function(data, status) {
            elog(data);
            $scope.data = data;
            if (data.result.returning.length === 0) {
                elog("returning error");
                return 0;
            }
            // fill entity
            $scope.facility = data.result.returning[0];
            elog($scope.facility);
            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
            elog("Error");
            elog(data);
        });
    };
    // <- get end
    $scope.init();
}

// <- End controller
FacilityFormCtrl.$inject = [ "$scope", "$routeParams", "$location", "$http" ];