
var crypto = require("crypto");

var md5 = crypto.createHash('md5');

var sha1 = crypto.createHash('sha1');

var s = sha1.update('foo');

var v = md5.update('mabo');

console.log(v.digest('hex'));

console.log(s.digest('hex'));