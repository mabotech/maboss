(function() {
  "use strict";

  /*
  Data  Services
   */
  angular.module("service.dataService", []).factory("dataService", [
    "$q", "jsonrpc", "$log", function($q, jsonrpc, $log) {
      return {

        /*
        get  value - text for select 2
         */
        getkv: function(options) {
          options.method = "mtp_select_cf2";
          options.value = options.text;
          return jsonrpc.call(options);
        },

        /*
        get value - text  on demand for select 2
         */
        getkv2: function(options) {
          return jsonrpc.call(options);
        },

        /*
        save one
         */
        save: function(options) {
          options.method = "mtp_upsert_cs8";
          options.columns = options.model;
          return jsonrpc.call(options);
        },

        /*
        delete one or some
         */
        del: function(options) {
          options.method = "mtp_delete_cf2";
          return jsonrpc.call(options);
        },

        /*
        get one
         */
        get: function(options) {
          options.method = "mtp_fetch_one_cf1";
          options.cols = Object.keys(options.model);
          return jsonrpc.call(options);
        },

        /*
        fetch some
         */
        fetch: function(options) {
          options.method = "mtp_search_cs5";
          return jsonrpc.call(options);
        }
      };
    }
  ]);

}).call(this);
