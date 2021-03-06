define([
  'angular',
  'app',
  'lodash'
], function (angular, app, _) {
  'use strict';
  var module = angular.module('grafana.controllers');
  module.controller('PulldownCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    function ($scope, $rootScope, $timeout) {
      var _d = {
          collapse: false,
          notice: false,
          enable: true
        };
      _.defaults($scope.pulldown, _d);
      $scope.init = function () {
        // Provide a combined skeleton for panels that must interact with panel and row.
        // This might create name spacing issues.
        $scope.panel = $scope.pulldown;
        $scope.row = $scope.pulldown;
      };
      $scope.toggle_pulldown = function (pulldown) {
        pulldown.collapse = pulldown.collapse ? false : true;
        if (!pulldown.collapse) {
          $timeout(function () {
            $scope.$broadcast('render');
          });
        } else {
          $scope.row.notice = false;
        }
      };
      $scope.init();
    }
  ]);
});