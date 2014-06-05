var winston = require('winston');

var util = require('util');

//var category1 = winston.loggers.get('category1');

var logger = winston.loggers.get('client');

var qs = require('qs');

module.exports = {

    log: function * () {
        /*
         * save client log
         */
       
        var params = this.jsonrpc_params; //qs.parse(this.request.body);
       
        var json_str = JSON.stringify(params);

        var msg = "msg"

        logger.log(msg);

        this.body = "";

    }
};
