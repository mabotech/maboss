var winston = require('winston');

var util = require('util');

//var category1 = winston.loggers.get('category1');

var logger = winston.loggers.get('app_debug');

var qs = require('qs');

var db = {
    tobi: {
        name: 'tobi',
        species: 'ferret'
    },
    loki: {
        name: 'loki',
        species: 'ferret'
    },
    jane: {
        name: 'jane',
        species: 'ferret'
    }
};

module.exports = {
    call: function * () {

        //default loggers
        logger.log('debug', 'in dbfunc');

        /*
         * query db with yield
         */

        var json_data = {"name":"name1", 'offset':'2', 'limit':2};

        var sql = util.format("select mt_user_rl_cf5 as result from mt_user_rl_cf5('%s') ", JSON.stringify(json_data));

        logger.log('debug', sql);

        var result = yield this.pg.db.client.query_(sql);

        if(result.rowCount==0){
            this.body = {"error":"no data"};
        }
        //console.log("result: %s", result);
        //var db_time = result.rows[0].now.toISOString();
        logger.log('debug', JSON.stringify(result));
        var data = result.rows[0].result;

        /*
         * parse request and get posted json
         */
        //var req = qs.parse(this.request.body);
        //var name = req.attr.name;
        //var pet = db[name];
        //if (!pet) return this.throw ('{"error":"cannot find that pet"}', 404);
        this.body = {
            "method": "call",
            "data": data
            //"worker name": pet.name,
            //"species": pet.species
        };

        //var names = Object.keys(db);
        //this.body = 'workers: ' + names.join(', ');
    },

    show: function * (name) {

        var pet = db[name];
        if (!pet) return this.throw ('{"error":"cannot find that pet"}', 404);
        this.body = {
            "worker name": pet.name,
            "species": pet.species
        };
    },

    work: function * () {

        //return this.throw('{"error":"test"}', 500);
        console.log("worker 2014");
        var v = qs.parse(this.request.body);
        console.log(v);
        console.log('info', JSON.stringify(v));
        this.body = {
            "worker": "work1"
        };

    }
};
