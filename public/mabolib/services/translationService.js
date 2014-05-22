"use strict";

//uglifyjs contextService.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("service.translationService", []).factory("translationService", function() {

    return {
        /*
            translate
            */
        translate: function(msgid) {
            
            return msgid
            
        }
    };
});