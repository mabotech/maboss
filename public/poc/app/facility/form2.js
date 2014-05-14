"use strict";

// uglifyjs form.js -b  --comments all 
/*
  * Company Controllers
  * Copyright
  * License MIT
  */
/*
  * CompanyFormCtrl
  * view of entity form
  *  Create or update
  */
function FacilityFormCtrl($scope, $routeParams, $location, $http) {
    elog("form");
    $scope.table = "facility";
    $scope.facility_id = $routeParams.id;
    //$scope.company = ["CCI","MT"];
    $scope.select2Options = {
        placeholder: "选择Company",
        //minimumInputLength: 1,
        allowClear: true,
        ajax: {
            // instead of writing the function to execute the request we use Select2's convenient helper
            //url: "/Mabo/utils/Service.aspx",
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
                        key: "id",
                        value: "texths",
                        languageid: "1033",
                        filter: term
                    }
                };
                return JSON.stringify(json_data);
            },
            results: function(data, page) {
                // parse the results into the format expected by Select2.
                /*
				var rtn = []; 

				for(var i=0; i< data.ListOriginalProductID.length; i ++){

					var d = {id:data.ListOriginalProductID[i], partno:data.ListOriPartNo[i],  text:data.ListOriPartNo[i]  + '-' + data.ListOriPartText[i] };

					rtn.push(d);
				}
                */
                // since we are using custom formatting functions we do not need to alter remote JSON data
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
    /**
       * get company for select2
       */
    /*
    $scope.get_company = function(){
      var jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_select_cf1",
                table: $scope.table,
                key:"id",
                value:"texths",
                 languageid: "1033",
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
            if (data.result.rows.length === 0) {
                elog("returning error");
                return 0;
            }
            // fill entity
            // rows? returning ?
            $scope.company = data.result.rows;

            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
            elog("Error");
            elog(data);
        });
    };
    // <-  end
   */
    /*
    $scope.select2Options = {
      //  allowClear:true
    };
    */
    $scope.init = function() {
        elog("init");
        //get company for select2
        //$scope.get_company();
        if ($scope.facility_id === undefined) {
            elog("b");
        } else {
            elog($scope.facility_id);
            $scope.get();
        }
    };
    // $scope.facility -> $scope.t_facility || $scope.obj ?
    // entity
    $scope.facility = {
        id: null,
        seq: null,
        facility: "",
        texths: null,
        /*
        currencycode: null,
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
    $scope.save = function() {
        $scope.post();
    };
    $scope.refresh = function() {
        $scope.get();
    };
    $scope.validate = function() {};
    /**
        *post
        */
    $scope.post = function() {
        elog("post");
        /*
        var columns = {
                    id:$scope.facility.id,
                    facility: $scope.facility.facility,
                    texths: $scope.facility.texths,
                    currencycode: $scope.facility.currencycode,
                    domainmanagerid:$scope.facility.domainmanagerid,
                    objectclass:$scope.facility.objectclass,
                    rowversion:$scope.facility.rowversion
                };
            */
        elog($scope.facility.texths);
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
    $scope.get = function() {
        elog("post");
        /*
        var columns = {
                    id:$scope.facility.id,
                    facility: $scope.facility.facility,
                    texths: $scope.facility.texths,
                    currencycode: $scope.facility.currencycode,
                    domainmanagerid:$scope.facility.domainmanagerid,
                    objectclass:$scope.facility.objectclass,
                    rowversion:$scope.facility.rowversion
                };
            */
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