
/*
 * router configuration
 */
 
var Router = require('koa-router')

var mount = require('koa-mount')

var api = new Router();

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
            
            api.get('/', portal.index);

            api.post('/poc.test', poc.test);

            api
                .post('/fetch', dataset.fetch)
                .post('/work', dataset.work);

            api
                .post('/callproc.pgtime', callproc.pgtime)
                .post('/callproc.call', callproc.call);

            api
                .get('/datatables.call', datatables.call);
            
            //mount
            app.use(mount('/api', api.middleware()));
            
            //app.use(mount('/web', api.middleware()));
            
            return app;
        }

}