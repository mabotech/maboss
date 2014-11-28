'use strict';

angular.module('Company.form', ['ngRoute', 'schemaForm'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/form', {
            templateUrl: 'form/form.html',
            controller: 'FormCtrl'
            //controllerAs: '$scope'  // sg
        });
    }
])

.controller('FormCtrl', FormCtrl);

FormCtrl.$inject = ['$scope', '$location', '$http'];

function FormCtrl($scope, $location, $http) {

    $scope.tag = "123abc";
    
        $scope.header = { name: 'header.html', url: 'partials/header.html'};
    
    $scope.left = { name: 'left.html', url: 'partials/left.html'};

    //generate schema & form on the server side
    $http.get('form/schema_form.json').then(function(res) {
        $scope.schema = res.data.schema;
        $scope.form = res.data.form;
        
        //assign enum and titleMap
        
        $scope.schema.properties.title.enum = ["dr","jr","sir","mrs","mr","NaN","dj"];
        for (var item in $scope.form){            
            if($scope.form[item] == "title"  || $scope.form[item].key == "title"){
                $scope.form[item].titleMap =   [{"value":"sir","name":"-Sir-"},{"value":"mr","name":"-Mr-"}]
            }            
        }        
        // $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
        //   $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
    });
    $scope.decorator = 'bootstrap-decorator';

    $scope.itParses = true;
    $scope.itParsesForm = true;

    $scope.pretty = function() {
        return JSON.stringify($scope.modelData, undefined, 2, 2);
    };

    $scope.submitForm = function(form, model) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');
        // Then we check if the form is valid
        if (form.$valid) {
            console.log(JSON.stringify(form));
            var v = {
                "table": "ttt",
                cols: model
            };
            console.log(JSON.stringify(v));
            // alert('You did it!');
        }
    }

    //console.log("redirect");

    //$location.url("/table");
    //$scope.tag = "123";

};
