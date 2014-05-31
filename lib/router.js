
var winston = require('winston');
var logger = winston.loggers.get('router');
var Router = require('koa-router')

var api = new Router();

module.exports = {
    
    get:function(path, method){
        logger.debug("GET", path);
        //register router
        api.get(path, method);        
    },
    
    post:function(path, method){  
        logger.debug("POST", path); 
        //register router        
        api.post(path, method);
    },
    
    get_middleware:function(){        
        return api.middleware();    
    }
    
}