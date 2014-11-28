'use strict';

angular.module('Company.table', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/table', {
    templateUrl: 'table/table.html',
    controller: 'TableCtrl'
  });
}])

.controller('TableCtrl', ['$scope', function($scope) {
    
    $scope.header = { name: 'header.html', url: 'partials/header.html'};
    
    $scope.left = { name: 'left.html', url: 'partials/left.html'};
    
    $scope.menu_items = [
    {"url":"#/table", "name":"Dashboard","icon":"dashboard"},
     {"url":"#/form", "name":"Form","icon":"bar-chart-o"},    
    ];

}]);