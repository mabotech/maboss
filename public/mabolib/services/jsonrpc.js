(function() {
  "use strict";

  /*
  jsonrpc client for angular
  uglifyjs jsonrpc.js -b  --comments all
   */
  angular.module("service.jsonrpc", []).factory("jsonrpc", [
    "$q", "$http", "$log", function($q, $http, $log) {
      var defaults, id;
      defaults = this.defaults = {};
      id = 0;
      defaults.basePath = "/rpc";
      defaults.url = "/api/callproc.call";

      /*
      call remote method in jsonrpc, accept: application/json
      @options
       */
      return {
        call: function(options) {

          /*
          deferred must be declared local
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
            url: defaults.url,
            data: payload
          }).success(function(data, status) {
            var result;
            result = (data.id === id ? data.result || data.error : null);
            result.id = data.id;
            return deferred.resolve(result);
          }).error(function(reason, status) {
            return deferred.reject(reason);
          });
          return deferred.promise;
        }
      };
    }
  ]);

}).call(this);
