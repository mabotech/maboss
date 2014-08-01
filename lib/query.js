"use strict";

/*
* query builder
*/

var pg = require('knex')({
  client: 'pg',
  connection: "postgres://mabotech:mabouser@localhost:6432/maboss"
});

var sql = pg.select("id", "createdon").table('url').where("id","=",12);

console.log(sql.toSQL());

console.log(sql.toString());
