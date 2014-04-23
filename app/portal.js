/*
 * maboss portal
 */
 
var qs = require('qs');

module.exports = {

    index: function *(){
        //var name = "jane";
        //var pet = db[name];

        //yield [1];
        //if (!pet) return this.throw('{"error":"cannot find that pet"}', 404);
        var nconf = this.nconf;
        this.body = {"message":"Welcome!", "app": "maboss", "version": nconf.get("app").version};
    },

    list: function *(){
        var names = Object.keys(db);
        this.body = 'workers: ' + names.join(', ');
    },

    work:function *(){

        //return this.throw('{"error":"test"}', 500);
        console.log("worker 2014");
        var v = qs.parse(this.request.body);
        console.log(v);
        console.log('info', JSON.stringify(v));
        this.body = {"worker":"work1"};
        
    }
};
