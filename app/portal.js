
var qs = require('qs');

var db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};


module.exports = {
  list: function *(){
    var names = Object.keys(db);
    yield [1];
    this.body = 'workers: ' + names.join(', ');
  },

  show: function *(){
    var name = "jane";
    var pet = db[name];

    yield [1];
    if (!pet) return this.throw('{"error":"cannot find that pet"}', 404);
    this.body = {"worker name": pet.name , "species" : pet.species};
  },

  work:function *(){

    //return this.throw('{"error":"test"}', 500);
    console.log("worker 2014");
    var v = qs.parse(this.request.body);
    yield [1];
    console.log(v);
    console.log('info', JSON.stringify(v));
    this.body = {"worker":"work1"};

  }
};
