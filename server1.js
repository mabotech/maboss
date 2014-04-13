/*
 * maboss server
 * version: 0.0.1
 * require nodejs with harmony
 */

/*
 * init
 */

var debug = require('debug')('http');
var http = require('http');

//var process = require('process');

var koa = require('koa');

var redis = require("redis");

var session = require('koa-session');
/*
 * logging
 */
var winston = require('winston');

var nconf = require('nconf');

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

var error = require('koa-error');

var koa_body = require('koa-body');

var koaPg = require('koa-pg')


var route = require('./config/route');
//var router = require('koa-router')

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var password = md5.update('mabotech').digest('hex'); //md5.update('mabotech').digest('base64');

/*
 * load config
 */
nconf.file('config/config.json');

var app = koa();

app.keys = ['mabo secret'];

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
app.use(error());

app.use(session());

/*
 * error handling
 */


/*
 *
 */

var conString = nconf.get('db').conString
app.use(koaPg(conString))

/*
 * body parse
 */
app.use(koa_body());

// TODO: add body parse here


/*
 * redis config and connect
 */

var client = redis.createClient(6379, '127.0.0.1', {});

client.on("error", function(err) {
    console.log("Error " + err);
});

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
    logger.log('debug', '------------------------------------------');

    //logger.log('debug', this.req.rawHeaders);

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

    var ms = new Date() - start

    this.set('X-Response-Time', ms + 'ms');

    perf.log("debug", "%s - %s", ms, this.originalUrl);

});


/*
 * build jsonrpc
 */
app.use(function * (next) {

    var id = 123;

    yield next;

    logger.log('info', this.response._status);



    if (this.response._status != 200) { //this.body == undefined){//) {  //(app.outputErrors

        //logger.debug("error",Object.keys(this));
        /*
        this.body = {
            "jsonrpc": "2.0",
            "error": [this.res.statusCode, this.originalUrl, this.response.statusString].join(' '),
            "id": id,
            "session": this.session.views,
            "sec": password
        };
        */
    } else {

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

app = route.add(app);

/*
app.use(router(app));
var dataset = require('./app/dataset');
var callproc = require('./app/callproc');
app.post('test','/test', callproc.test);
app.post('work','/work', dataset.work);
*/


app.on('error', function(err, ctx) {
    // Log errors.
    logger.log('error', ctx.request.ip, ctx.originalUrl);
    logger.log('error', err.status);
});

/*
 * start server
 */
var port = 6226

//app.listen(port);

logger.log('info', 'node version:', process.version);
//logger.log('info', 'processor architecture: ' + process.arch);
logger.log('info', 'pid: %s', process.pid);
logger.log('info', 'execPath: %s, Cwd: %s', process.execPath, process.cwd());

http.createServer(app.callback()).listen(port);
logger.log('info', 'listening on port %s', port);


http.createServer(app.callback()).listen(port + 1);
logger.log('info', 'listening on port %s', port + 1);
//console.log('listening on port %s', port);
