"use strict";

var winston = require('winston');
var util = require('util');

var logger = winston.loggers.get('app_debug');


module.exports = {

    version:function *(){
        this.body = "0.0.3";        
        
    },
    
    time:function * (){
        this.body = "2014-06-28 10:11:23";        
    }
    
    
}