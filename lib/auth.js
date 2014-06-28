"use strict";

var winston = require('winston');
var logger = winston.loggers.get('router');

var passport = require('koa-passport');

// ?
var user = { id: 1, username: 'test' };

//
passport.serializeUser(function(user, done) {
  done(null, user);
})

//
passport.deserializeUser(function(id, done) {
    logger.debug("user id:", id);
    done(null, user);
})

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(username, password, done) {
  // retrieve user ...
    
    //get user.password

  //var query = {"table":"employee", "cols":["password"], "domain":[[["username","=",username]]]};
    
    //select password from employee where username = i_username;
    
    
  if (username != '' && password === 'test') {
    
    //set user info
    user.username = username;
    user.facility = "MT";
    user.language = 2052;
  
    done(null, user);
  } else {
    done(null, false);
  }
}))

