'use strict';


// Declare app level module which depends on filters, and services
angular.module('maboss', [
  'ngRoute',
  'ui.bootstrap', // 'ui.select2'
  'ui.validate',
  'ui.select2',
  //'maboss.filters',
  'maboss.services',
  'service.dataService',
 // 'maboss.directives',
 //controllers
  'maboss.FacilityListCtrl'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/company.form', {templateUrl: 'app/company/form.html', controller: 'CompanyFormCtrl'});
  $routeProvider.when('/company.form/:id', {templateUrl: 'app/company/form.html', controller: 'CompanyFormCtrl'});
  $routeProvider.when('/company.list', {templateUrl: 'app/company/list.html', controller: 'CompanyListCtrl'});
  
  $routeProvider.when('/facility.form', {templateUrl: 'app/facility/form.html', controller: 'FacilityFormCtrl'});
  $routeProvider.when('/facility.form/:id', {templateUrl: 'app/facility/form.html', controller: 'FacilityFormCtrl'});
  $routeProvider.when('/facility.list', {templateUrl: 'app/facility/list.html', controller: 'FacilityListCtrl'});
  
  $routeProvider.otherwise({redirectTo: '/company.list'});
}]);
