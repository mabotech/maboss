'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('fbpoc', [
  'ngRoute',
  'ui.bootstrap',
  //form builder
  'builder', 
  'builder.components', 
  'validator.rules',
  //controllers
  'service.jsonrpc',
  'service.sessionService',
  'service.dataService',
  'fbpoc.BuilderCtrl',
  'fbpoc.CompanyFormCtrl'
]);

/**
* route config
*/
app.config(['$routeProvider', function($routeProvider) {

 $routeProvider.when('/builder', {templateUrl: 'app/builder.html', controller: 'BuilderCtrl'});
  
  $routeProvider.when('/form', {templateUrl: 'app/form.html', controller: 'CompanyFormCtrl'});
  
  $routeProvider.otherwise({redirectTo: '/builder'});
}]);

/**
* central config for app
*/

centralConfig(app);
