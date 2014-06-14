"use strict";
/*
 * maboss server
 * version: 0.0.1
 * require nodejs with harmony
 * HTTP request MUST be jsonrpc all, and reply in jsonrpc
 * 
 */

/*
 * init
 */
var nconf = require('nconf');
var debug = require("debug")('http');
var http = require('http');

//var process = require('process');

var koa = require('koa');
var redis = require("redis");
var session = require('koa-session');
/*
 * logging
 */
var winston = require('winston');

//winston.add(winston.transports.Console, {silent:true} );
//winston.remove(winston.transports.Console);
/*
winston.add(winston.transports.File, {
    filename: 'log/maboss.log',
    json: false,
    maxsize: 300,
    maxFiles: 3
});
*/

// category: server
var logger = winston.loggers.add('server', {
    console: {
        //silent:true,
        level: 'debug',
        colorize: 'true',
        label: 'server'
    },
    file: {
        filename: 'logs/maboss.log',
         label: 'server',
        level: 'debug',
        json: false,
        maxsize: 10240000,
        maxFiles: 10
    }
});

// category: app_debug
winston.loggers.add('app_debug', {
    console: {
        //silent:true,
        level: 'debug',
        colorize: 'true',
        label: 'app'
    },
    file: {
        filename: 'logs/app_debug.log',
        level: 'debug',
        json: false,
        maxsize: 10240000,
        maxFiles: 10
    }
});

// category: client
winston.loggers.add('client', {
    console: {
        //silent:true,
        level: 'debug',
        //colorize: 'true',
        label: 'client'
    },
    file: {
        filename: 'logs/client.log',
        level: 'debug',
        json: false,
        maxsize: 10240000,
        maxFiles: 10
    }
});

/*
 * category: performance logging
 */
var perf = winston.loggers.add('performance', {
    console: {
        //silent:true,
        level: 'debug',
        colorize: 'true',
        label: 'perf'
    },
    file: {
        filename: 'logs/performance.log',
        level: 'debug',
        json: false,
        maxsize: 10240000,
        maxFiles: 10
    }
});

/*
var logger = new (winston.Logger)({
transports: [
  new (winston.transports.Console)({
      //silent:true,
      level: 'debug',
      colorize: 'true',
      label: 'category one'
    }),
  new (winston.transports.File)({
      filename: 'log/maboss.log',
      level: 'debug',
      json: false,
      maxsize: 300,
      maxFiles: 3
    })
]
});
*/

//var category1 = winston.loggers.get('category1');

//var error = require('koa-error');

var koa_body = require('koa-body');

var qs = require('qs');

var koaPg = require('koa-pg');

//var router = require('koa-router')

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var password = md5.update('mabotech').digest('hex'); //md5.update('mabotech').digest('base64');

/*
 * load config
 */
nconf.file('config/config.json');

//var route = require('./config/route');

var router = require('./config/router');

var app = koa();

app.keys = [nconf.get("app").keys];

/*
app.use(function *(next) {
  
    try {
      yield next;
    } catch (err) {
      this.status = err.status || 500;
      this.body = err.message || require('http').STATUS_CODES[this.status];
      this.app.emit('error', err, this);
 
  }
})
 
*/

/*
 * error handling, as the first(outermost) middleware 
 */
//app.use(error());

// customized error handling
app.use(function *(next){
     var env = process.env.NODE_ENV || 'development';
    try {
        
        yield next;
        
        if (null == this.status) this.throw(404);
        if(405 == this.status) this.throw('Method Not Allowed', 405);
        
    } catch (err) {
        
        
        this.status = err.status || 500;
        
        if ('development' == env){
              //this.body = {jsonrpc:"2.0", error: err.message, id:"r1"}
              this.body = {jsonrpc:"2.0", error: err.stack, id:"r1"}
        }
        else if (err.expose) {
            //this.body = { jsonrpc:"2.0", error: err.messag, id: "r1" }
            this.body = { jsonrpc:"2.0", error: err.stack, id: "r1" }
        }
        else{ 
            this.body = { jsonrpc:"2.0", error: http.STATUS_CODES[this.status] , id: "r1"}
        }
        
    }
});

//
app.use(session());

/*
 * init
 */

var con_string = nconf.get('db').con_string;
app.use(koaPg(con_string));

/*
 * body parse
 */
app.use(koa_body());

// TODO: add body parse here

/*
 * redis config and connect
 */

var client = redis.createClient(nconf.get('redis').port, nconf.get('redis').server, {});

client.on("error", function(err) {
    console.log("Error " + err);
});

/*
 * redis client
 */
app.use(function * (next) {

    var start = new Date();

    logger.debug('debug', "connected:", client.connected);

    client.set("calledOn", start.toISOString(), function(error, reply) {

    });

    yield next;

});


/*
 * performance
 */
app.use(function * (next) {
    
    //logger.log('debug', this.req.rawHeaders);
    
    this.nconf = nconf;

    var start = new Date();
    // console.log(start);

    // TODO: get session from request   

    //this.throw("test throw", 500);

    var n = this.session.views || 0;
    
    this.session.views = ++n;

    if (this.session.views < 1) {
        //this.body = "please login"
        this.redirect('/login');
        return;
    }

    yield next;

    var ms = new Date() - start;

    //set process time in millisecond
    this.set('X-Response-Time', ms + 'ms');

    //performance log
    perf.log("debug", "%s - %s", ms, this.path);//originalUrl);

});


/*
 * build jsonrpc
 */
app.use(function * (next) {

    var params = qs.parse(this.request.body);
    
    var id = "r1";
    
    logger.log('debug', params)
    
    logger.log('debug', typeof(params))
    
    if (params != undefined){
        
        if ("params" in params){
            logger.log('debug', JSON.stringify(params.params));
            //add parsed params for this(ctx).
            //be care name conflict.
            this.jsonrpc_params = params.params;
            
            logger.log('debug', JSON.stringify(this.jsonrpc_params));
            //set default jsonrpc id.
       
        }
        if("id" in params){
            id = params.id;
        }
    }
    else{
        
        //this.jsonrpc_params = [] ;
        
    }
    // TODO: security check
    
    yield next;

    logger.log('info', this.response._status);
    
    
    logger.debug("info", this.res._headers)
    for(k in Object.keys(this)){
        
     //   logger.debug("info",k );    
        
    }
    

    if (this.response._status != 200) { //this.body == undefined){//) {  //(app.outputErrors
        /*
        if(this.status == null){
                this.status = 404;
        }
        
        logger.log('error', ["remote:",this.request.ip, "url:",this.originalUrl].join(" "));
        
        this.body = {
            "jsonrpc": "2.0",
            "error": this.response.statusString,
            "id": id,
            "session": this.session,
            "sec": password
        };
        */
        //logger.debug("error",Object.keys(this));
    
    } else if (this.path == '/api/datatables.call'){
        var data;
        if(this.body.rows){
                data = this.body.rows   
        }else{
            
            data = [];
            }
        
        this.body = {         
              "draw": this.body.draw,
              "recordsTotal": this.body.total,
              "recordsFiltered":  this.body.count,
              "data":data         
            };
        
    }else {

        //make jsonrpc reply.
        this.body = {
            "jsonrpc": "2.0",
            "result": this.body,
            "id": id,
            "session": this.session,
            "sec": password
        };
    }

});

//add route

//app = route.add(app);

//mount Router
app = router.app_mount(app);

/*
app.use(router(app));
var dataset = require('./app/dataset');
var callproc = require('./app/callproc');
app.post('test','/test', callproc.test);
app.post('work','/work', dataset.work);
*/

/*
 * koa.error:  this.app.emit('error', err, this);
*/
app.on('error', function(err, ctx) {
    // Log errors.
    logger.log('error', ["remote:",ctx.request.ip, "url:",ctx.originalUrl].join(" "));
    logger.log('error', err.status||500);
    //logger.log('error', Object.keys(ctx.response));
    logger.log('error', ctx.response.res.statusCode);
    logger.log('error', err.stack);
});

/*
 * start server
 */
var port = nconf.get("app").port;

//app.listen(port);

logger.log('info', 'node version:', process.version);
//logger.log('info', 'processor architecture: ' + process.arch);
logger.log('info', 'pid: %s', process.pid);
logger.log('info', 'execPath: %s, Cwd: %s', process.execPath, process.cwd());

http.createServer(app.callback()).listen(port);
logger.log('info', 'listening on port %s', port);

/*
//second port
http.createServer(app.callback()).listen(port + 1);
logger.log('info', 'listening on port %s', port + 1);
*/
//console.log('listening on port %s', port);
