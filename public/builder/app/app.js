'use strict';

// Declare app level module which depends on filters, and services
angular.module('fbpoc', [
  'ngRoute',
  
  'builder', 
  'builder.components', 
  'validator.rules',
  
 'fbpoc.BuilderCtrl',
  'fbpoc.FormCtrl'
]).
config(['$routeProvider', function($routeProvider) {

 $routeProvider.when('/builder', {templateUrl: 'app/builder.html', controller: 'BuilderCtrl'});
  
  $routeProvider.when('/form', {templateUrl: 'app/form.html', controller: 'FormCtrl'});
  
  $routeProvider.otherwise({redirectTo: '/builder'});
}]);
