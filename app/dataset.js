var qs = require('qs');

module.exports = {
    fetch: function * () {

        var result = yield this.pg.db.client.query_('SELECT now()')
        //console.log("result: %s", result);
        var db_time = result.rows[0].now.toISOString();

        this.body = 'db_time: ' + db_time;
    },

    show: function * (name) {
        var pet = db[name];
        if (!pet) return this.
        throw ('{"error":"cannot find that pet"}', 404);
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
