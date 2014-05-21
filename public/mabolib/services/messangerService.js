"use strict";

//uglifyjs services.js -b  --comments all 
/**
  *Mabo Services 
  */
angular.module("service.messanger", []).factory("messanger", function() {
    //utils, helpers
    var ID = 0;
    
    var MID = 0;
    
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
        theme: 'air'
    }
    
    return {
        elog: function(message) {
            console.log(message);
        },
        
        post:function(level, message){
            MID = MID +1;
            
            //var dt = new Date();
            
            if (level == 'info'){
                Messenger().post({
                    message:  "[ "+MID+" ] &nbsp;&nbsp;&nbsp;"+message,
                    type: 'info',
                    hideAfter:2
                    //showCloseButton: true
                });
            }else if (level == 'error'){
                      Messenger().post({
                    message:message,
                    type: 'error',
                    showCloseButton: true
                });          
                }
            
            },
        
        getId: function() {
            ID = ID + 1;
            return "r" + ID;
        },
        auth: function() {
            return true;
        }
    };
});