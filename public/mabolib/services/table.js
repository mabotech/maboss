"use strict";

//uglifyjs table.js -b  --comments all 
/**
  *Table  Services 
  */
angular.module("service.table", []).factory("table", [ "$q", function($q) {
    //global var
    var DEFAULT_SORT_ICON = "";
    var SORT_UP_ICON = "chevron-up";
    var SORT_DOWN_ICON = "chevron-down";
    var DEFAULT_PAGE_SIZE = 15;
    // return methods
    return {
        /**
        *
        */
        init: function() {},
        /**
        *
        */
        filter_change: function() {},
        /**
        *
        */
        page_changed: function() {},
        /**
        *
        */
        sort: function() {}
    };
} ]);