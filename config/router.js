
/*
 * router configuration
 */
 
//var Router = require('koa-router')

var mount = require('koa-mount')

//var api = new Router();

var router = require('../lib/router')

// app
var poc = require('../app/poc');
var portal = require('../app/portal');
var dataset = require('../app/dataset');
var callproc = require('../app/callproc');

var datatables = require('../app/datatables');

module.exports = {
        
        /*
            * mount router
         */
        app_mount : function (app){
            
            router.get('/', portal.index);

            router.post('/poc.test', poc.test);

            router
                .post('/fetch', dataset.fetch);
            router.post('/work', dataset.work);

            router
                .post('/callproc.pgtime', callproc.pgtime);
             router.post('/callproc.call', callproc.call);

            router.get('/datatables.call', datatables.call);
            
            //mount
            var router_middleware = router.get_middleware();
            app.use(mount('/api', router_middleware));
            
            //app.use(mount('/api', api.middleware()));
            
            //app.use(mount('/web', api.middleware()));
            
            return app;
        }

}