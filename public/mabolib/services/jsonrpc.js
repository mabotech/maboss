// Generated by CoffeeScript 1.7.1
(function() {
  "use strict";
  angular.module("service.jsonrpc", []).factory("jsonrpc", [
    "$q", "$http", "$log", function($q, $http, $log) {
      var defaults, id;
      defaults = this.defaults = {};
      id = 0;
      defaults.basePath = "/rpc";
      return {
        call: function(options) {

          /*
          deferred must be declared inside
           */
          var deferred, payload;
          deferred = $q.defer();
          id = id + 1;
          payload = {
            jsonrpc: "2.0",
            id: id,
            method: "call",
            params: options
          };
          $http({
            method: "POST",
            url: "/api/callproc.call",
            data: payload
          }).success(function(data, status) {
            var result;
            $log.debug("success", data);
            result = (data.id === id ? data.result || data.error : null);
            result.id = data.id;
            return deferred.resolve(result);
          }).error(function(reason, status) {
            $log.debug("error", reason);
            return deferred.reject(reason);
          });
          return deferred.promise;
        }
      };
    }
  ]);

}).call(this);