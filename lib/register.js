"use strict";

var winston = require('winston');
var logger = winston.loggers.get('router');

var callproc = require("./callproc") 

module.exports = {
    
    /* 
      * register router url to database
     */
    
    register_url:function (url_prefix, router){
        
            var i=0;
        
            for(i=0;i <router.routes.length; i++){
                
                var path = router.routes[i].path;
                var methods = router.routes[i].methods;
                
                var params = JSON.stringify({"prefix" : url_prefix, "path" : path, "methods" : methods});
                
                logger.debug("reg1:", params);
                
                //callproc.wcall("mt_url_register_cs1", params);
                
                //logger.debug(logger);
                
                callproc.call("mt_url_register_cs1", params);
                
                    
                logger.debug("reg2", url_prefix, path , methods);
                
            }
        
    }
    
}