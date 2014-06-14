"use strict";

var app = require('koa')();

var server = require('http').Server(app.callback());

var io = require('socket.io')(server);

io.on('connection', function(){ 

    console.log("func");


    });
    
server.listen(3000);