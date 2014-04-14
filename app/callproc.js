var winston = require('winston');

var util = require('util');

//var category1 = winston.loggers.get('category1');

var logger = winston.loggers.get('app_debug');

var qs = require('qs');

module.exports = {

    pgtime:function *(){

            //how to catch? 

            //throw("in test");
            //this.throw("in test", 500);
           
            var params = this.params; //qs.parse(this.request.body);
            logger.log(params);
            
            sql = "select now()";
            var result = yield this.pg.db.client.query_(sql);
            
            this.body = {"pgtime":result.rows[0].now};
            
    },

    call: function * () {
        /*
         * query db with yield
         */

        //default loggers
        
        var params = this.params; //qs.parse(this.request.body);

        var method = params.method;

        var json_data = params.params;

        //console.log(typeof(json_data));  object
        
        logger.log(params);

        logger.log('debug', 'callproc');
        /*
        var func_name = "mtp_find_cf1";

        var json_data = {"table":"company", 
            "kv":{
                "company":'abc1'
            },
            "context":{"user":'u1', "languageid":"1033", "sessionid":"123" } 
            };
        */
        json_str = JSON.stringify(json_data);

        //escape "single quote"(')
        json_str = json_str.replace("'", "''");
        
        console.log(json_str);

        var sql = util.format("select %s as rdata from %s('%s')", method, method, json_str);

        logger.log('debug', sql);

        var result = yield this.pg.db.client.query_(sql);


        logger.log(result);
        /*
        if(result.rowCount==0){
            this.body = {"error":"no data"};
        }
        *-/

        //console.log("result: %s", result);
        //var db_time = result.rows[0].now.toISOString();
        logger.log('debug', JSON.stringify(result));
        var data = result.rows[0].rdata;
        */
        //if (!data) return this.throw ('{"error":"no data"}', 404);

        error = {
            "code":"errorcode",
            "message":"error msg",
            "data":"error data"
        };

        this.body = result.rows[0].rdata.result;
        /*{
            //"error": null,
            //"result":params, // result or error, only one could be sent to client.
            "data": 
        };*/
    }
};
