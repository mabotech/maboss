var winston = require('winston');

var util = require('util');

//var category1 = winston.loggers.get('category1');

var logger = winston.loggers.get('app_debug');

var qs = require('qs');

module.exports = {

    test:function *(){

            //how to catch? 

            //throw("in test");
            //this.throw("in test", 500);
           
            var v = qs.parse(this.request.body);
            logger.log(v);
            sql = "select now()";
            var result = yield this.pg.db.client.query_(sql);

            this.body = {"val":v};
            throw new Error('some error');

    },

    call: function * () {
        /*
         * query db with yield
         */

        //default loggers

        

        logger.log('debug', 'callproc');

        var func_name = "mtp_find_cf1";

        var json_data = {"name":"name1", 'offset':'2', 'limit':2};

        var sql = util.format("select %s as rdata from %s('%s') ", func_name, func_name, JSON.stringify(json_data));

        logger.log('debug', sql);

        var result = yield this.pg.db.client.query_(sql);

        /*
        if(result.rowCount==0){
            this.body = {"error":"no data"};
        }
        */

        //console.log("result: %s", result);
        //var db_time = result.rows[0].now.toISOString();
        logger.log('debug', JSON.stringify(result));
        var data = result.rows[0].rdata;

        //if (!data) return this.throw ('{"error":"no data"}', 404);
        this.body = {
            "method": "call",
            "data": data
        };
    }
};
