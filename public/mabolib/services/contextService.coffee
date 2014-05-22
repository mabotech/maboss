"use strict"

#uglifyjs contextService.js -b  --comments all 
###
Mabo Services
###
angular.module("service.contextService", []).factory "contextService", ->
    
    #
    #            get context
    #            
    get: ->
        languageid: 1033
        user: "idea"

