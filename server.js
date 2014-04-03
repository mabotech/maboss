/*
 * maboss server
 * version: 0.0.1
 * require nodejs with harmony
 */

/*
 * init
 */
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

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var password = md5.update('mabotech').digest('hex'); //md5.update('mabotech').digest('base64');

/*
 * load config
 */
nconf.file('config/config.json');

var app = koa();

app.keys = ['mabo secret'];
app.use(session());
/*
 * error handling
 */
app.use(error());

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
 * redis config here
 */
var client = redis.createClient();

app.use(function * (next) {

    var start = new Date();

    client.set("calledOn", start.toISOString(), function(error, reply) {


    });

    yield next;

});

/*
 * performance
 */
app.use(function * (next) {

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

    //if text then return body else return jsonrpc?

    //logger.debug("debug",Object.keys(app.error));


    if (this.body == undefined){//) {  //(app.outputErrors
        this.body = {
            "jsonrpc": "2.0",
            "error": 'msg', //err.stack
            "id": id,
            "session": this.session.views,
            "sec": password
        };
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

// TODO: print route url with method here
/*
app.on('error', function(err, ctx){
  logger.error('error', err.stack);
});
*/
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


http.createServer(app.callback()).listen(port+1);
logger.log('info', 'listening on port %s', port+1);
//console.log('listening on port %s', port);
