"use strict";

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
  
  console.log("form");
  
  var app = angular.module('maboss', []).config('CompanyFormCtrl', 
    ['$scope',  '$routeParams',  '$location',  '$http', 'sessionService', 'common', 'initSelect2', 
        function($scope,  $routeParams,  $location,  $http, sessionService, common, initSelect2) {
    //elog("form");
     console.log("form2");
    $scope.table = "company";
    
     $scope.company_id =  $routeParams.id;
        
    $scope.currencycode = ["CNY","USD"];
    
       $scope.select2Options = {
      //  allowClear:true
    };
    
    $scope.callback = function(data){
        
        console.log(JSON.stringify(data));
    };
        
        var params2 = {
            table:"company",
            pkey:"company",
            ptext:"company",
            languageid:1033
            };
        initSelect2.get("",params2,$scope.callback);
        
             params2 = {
            table:"facility",
            pkey:"facility",
            ptext:"texths",
            languageid:1033
            };
        initSelect2.get("",params2,$scope.callback);
           
         params2 = {
            table:"company",
            pkey:"company",
            ptext:"texths",
            languageid:1033
            };
        initSelect2.get("",params2,$scope.callback);            
            
    $scope.init = function() {
    //    elog("init");
        if ($scope.company_id === undefined){
           // elog("b");
            //$location.url("/company.list");  
        }else{
       //     elog($scope.company_id);
            $scope.get();
        }

    };
    // $scope.company -> $scope.t_company || $scope.obj ?
    // entity
    $scope.company = {
        company: null,
        //seq: null,
        texths: null,
        currencycode: null,
        //codesystemtype: null,
        //domainmanagerid: null,
        //formattype: null,
        //objectclass: null,
        modifiedon:null,
        modifiedby:null,
        createdon:null,
        createdby:null,
        rowversion: null
    };
    
    /**
       * save
       */
    $scope.save = function(){
        
        $scope.post();
        };
        
        $scope.refresh = function(){
            

             common.post('info', "refresh");
            common.elog("refresh");
            $scope.get();
            
            };
        
                    $scope.validate = function(){
            
            /*
            
                if($scope.company.company.length>4){
                    
                    return;
                    }
                if ($scope.company.texths === null ||  $scope.company.texths == undefined){
                    //alert("text required");
                    return;
                    }
                    */
            
            };
            
    /**
        * post
        */
    $scope.post = function() {
       // elog("post");
        /*
        var columns = {
                    id:$scope.company.id,
                    company: $scope.company.company,
                    texths: $scope.company.texths,
                    currencycode: $scope.company.currencycode,
                    domainmanagerid:$scope.company.domainmanagerid,
                    objectclass:$scope.company.objectclass,
                    rowversion:$scope.company.rowversion
                };
            */
        

        
        //elog($scope.company.texths);
            
        $scope. jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_upsert_cs8",
                table: $scope.table,
                pkey:"company",
                //eneity
                columns: $scope.company,
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        //elog($scope.jsonrpc_params);
         $scope.params = JSON.stringify($scope.jsonrpc_params,null, 4);
        // call ajax
        $http({
            method: "POST",
            url: "/api/callproc.call",
            data: $scope.jsonrpc_params
        }).success(function(data, status) {
           // elog(data);
            $scope.data =  JSON.stringify(data, null, 4);
            if (data.result.returning.length === 0) {
              //  elog("returning error");
                return 0;
            }
            // fill entity
            //$scope.company.id = data.result.returning[0].id;
            //$scope.company.seq = data.result.returning[0].seq;
            $scope.company.modifiedon = data.result.returning[0].modifiedon;
            $scope.company.modifiedby = data.result.returning[0].modifiedby;
            $scope.company.createdon = data.result.returning[0].createdon;
            $scope.company.createdby = data.result.returning[0].createdby;
            $scope.company.rowversion = data.result.returning[0].rowversion;
            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
        //    elog("Error");
         //   elog(data);
        });
    };
    // <- end post
        /**
             * get
             */
    
        $scope.get = function() {
      //  elog("post");
        /*
        var columns = {
                    id:$scope.company.id,
                    company: $scope.company.company,
                    texths: $scope.company.texths,
                    currencycode: $scope.company.currencycode,
                    domainmanagerid:$scope.company.domainmanagerid,
                    objectclass:$scope.company.objectclass,
                    rowversion:$scope.company.rowversion
                };
            */
            
            
        $scope.jsonrpc_params = {
            jsonrpc: "2.0",
            id: "r2",
            method: "call",
            params: {
                method: "mtp_get_cs3",
                table: $scope.table,
                pkey:"company",
                //eneity
                id: $scope.company_id,
                cols:Object.keys($scope.company) ,
                 languageid: "1033",
                context: {
                    user: "idea",
                    languageid: "1033"
                }
            }
        };
        
        $scope.params = JSON.stringify($scope.jsonrpc_params,null, 4);
        //elog($scope.jsonrpc_params);
        // call ajax
        
        $scope.url = "/api/callproc.call";
        $http({
            method: "POST",
            url: $scope.url,
            data: $scope.jsonrpc_params
        }).success(function(data, status) {
          //  elog(data);
            $scope.data = JSON.stringify(data, null, 4);
            if (data.result.returning.length === 0) {
                //elog("returning error");
                return 0;
            }
            // fill entity
            
            $scope.company = data.result.returning[0];

            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
            // error handling and alert
        //    elog("Error");
           // elog(data);
        });
    };
    // <- get end
    $scope.init();
}]);

// <- End controller
// CompanyFormCtrl.$inject = [ "$scope", "$routeParams", "$location",  "$http" ,"sessionService", "common","initSelect2"];

