"use strict";
/*
 * router configuration
 */
 
var winston = require('winston');
var logger = winston.loggers.get('router');
 
var Router = require('koa-router')

var mount = require('koa-mount')



//var router = require('../lib/router')

// app
var register = require('../lib/register');

var callproc = require('../lib/callproc');

var poc = require('../app/poc');
var portal = require('../app/portal');
var dataset = require('../app/dataset');


var client = require('../app/client');

var datatables = require('../app/datatables');

var api = new Router();

module.exports = {
        
        /*
            * mount router
         */
        app_mount : function (app){
            
            api.get( '/', portal.index);

            api.post( '/poc.test', poc.test);

            api
                .post('/fetch', dataset.fetch)
            .post( '/work', dataset.work);

            api
                .post( '/callproc.pgtime', callproc.pgtime)
             .post( '/callproc.call', callproc.call);

            api.get( '/datatables.call', datatables.call);
            
            api.post( '/client.log', client.log);
            
            //mount
            //var router_middleware = router.get_middleware();
            
            //app.use(mount('/api', router_middleware));
            //app.use(router.mount_middleware(api, '/api'))
            
            var url_prefix = '/api'
            app.use(mount(url_prefix, api.middleware()));
            
            register.register_url(url_prefix, api);
            /*
                var i=0;
                for(i=0;i <api.routes.length; i++){
                    var path = api.routes[i].path;
                    var methods = api.routes[i].methods;
                    logger.debug(url_prefix,path , methods);
                    
                }
                */
            
            //app.use(mount('/web', api.middleware()));
            
            return app;
        }

}