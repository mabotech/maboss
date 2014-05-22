"use strict";

//uglifyjs contextService.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("service.contextService", []).factory("contextService", function() {

    return {
        /*
            get context
            */
        get: function() {
            
            return {
                    languageid:1033,
                    user:'idea'                
                }
            
        }
    };
});