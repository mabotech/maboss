
var Router = require('koa-router')

var mount = require('koa-mount')

// app
var poc = require('../app/poc');
var portal = require('../app/portal');
var dataset = require('../app/dataset');
var callproc = require('../app/callproc');

var api = new Router();


var showFoo = function * (){
    
    this.body = "showFoo"
    
    }
    
var createFoo = function *(){
    
    this.body = "createFoo"
    
    }


    module.exports = {

        app_mount : function (app){
            
            api
              .get('/foo', showFoo)
              .post('/foo', createFoo);
            
            api.get('/', portal.index);

            api.post('/poc.test', poc.test);

            api.post('/fetch', dataset.fetch);

            api.post('/work', dataset.work);

            api.post('/callproc.pgtime', callproc.pgtime);
            
            api.post('/callproc.call', callproc.call);
            
            //mount
            app.use(mount('/api', api.middleware()));
            
            return app;
        }

}