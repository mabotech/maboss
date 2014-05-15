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
        // parse
        var params =qs.parse(this.querystring);
        
        //logger.log('debug', this.querystring)
        
        logger.log('debug', JSON.stringify(params))
        
        var json_params = {}
            
        var i
        var cols = []
        for(i = 0; i < params.columns.length;i++){
        
            cols.push(params.columns[i].data)
            
        }
        
        json_params.cols = cols
        json_params.table = params.table
        json_params.pkey = params.pkey
        json_params.limit = params.length
        json_params.offset = params.start
        
        var draw = params.draw
        
        //if (params.order[0].column != '0'){
        json_params.orderby = [parseInt(params.order[0].column)+1, params.order[0].dir].join(" ")
        //}
        if(params.search.value !== ""){
            json_params.domain = [[[cols[0], "ilike", params.search.value+"%"]]]
        }
        var method;
        
        if(params == undefined){
            
         this.throw("please provide params to datatables.call", 500)
        }
        
        if ("method" in params){
            method = params.method;
        }
        else{
            
            this.throw("please provide method to datatables.call", 500)
        }

        //var json_data = params.params;

        //console.log(typeof(json_data));  object
        
        logger.log('debug', JSON.stringify(params));

        logger.log('debug', this.jsonrpc_params);
        
    //var params2 = qs.parse(this.request.body);
    
    //logger.log('debug', JSON.stringify(params2.params));        
        /*
        var func_name = "mtp_find_cf1";

        var json_data = {"table":"company", 
            "kv":{
                "company":'abc1'
            },
            "context":{"user":'u1', "languageid":"1033", "sessionid":"123" } 
            };
        */
        json_str = JSON.stringify(json_params);

        //escape "single quote"(')
        //modified on 2014-04-29 15:13:45
        if ( typeof (json_str) == 'string'){
            
            json_str = json_str.replace("'", "''");        
            console.log(json_str);
        }
        else{
            
            this.throw("params undefined", 500);
            
        }
        
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

        this.body = result.rows[0].rdata;
        this.body.draw = draw;
        /*{
            //"error": null,
            //"result":params, // result or error, only one could be sent to client.
            "data": 
        };*/
    }
};
