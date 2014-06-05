
/*
 * router configuration
 */
 
 var winston = require('winston');
var logger = winston.loggers.get('router');
 
var Router = require('koa-router')

var mount = require('koa-mount')



//var router = require('../lib/router')

// app
var poc = require('../app/poc');
var portal = require('../app/portal');
var dataset = require('../app/dataset');
var callproc = require('../app/callproc');

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
            
            api.get( '/client.log', client.log);
            
            //mount
            //var router_middleware = router.get_middleware();
            
            //app.use(mount('/api', router_middleware));
            //app.use(router.mount_middleware(api, '/api'))
            
            
            app.use(mount('/api', api.middleware()));
            
            var i=0;
            for(i=0;i <api.routes.length; i++){
                logger.debug(api.routes[i]);
                
            }
            
            //app.use(mount('/web', api.middleware()));
            
            return app;
        }

}