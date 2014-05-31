
var winston = require('winston');
var logger = winston.loggers.get('router');

var mount = require('koa-mount')
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
    
    mount_middleware:function(mount_point){
        return mount(mount_point, api.middleware() )
    }      
    /*
    get_middleware:function(){        
        return api.middleware();    
    }
    */
    
}