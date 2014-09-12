'use strict';

// Declare app level module which depends on views, and components
angular.module('Company', [
  'ngRoute',
  'Company.table',
  'Company.form',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/table'});
}]);
