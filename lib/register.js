"use strict";

var winston = require('winston');
var logger = winston.loggers.get('router');

module.exports = {
    
    /* register router url to database
      *
     */
    
    register_url:function(url_prefix, router){
        
            var i=0;
        
            for(i=0;i <router.routes.length; i++){
                
                var path = router.routes[i].path;
                var methods = router.routes[i].methods;
                    
                logger.debug(url_prefix, path , methods);
                
            }
        
    }
    
}