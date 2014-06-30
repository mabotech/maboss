"use strict";

// run one

var winston = require('winston');
var logger = winston.loggers.get('router');

var bodyParser = require('koa-bodyparser');

var passport = require('koa-passport');

var Router = require('koa-router');
var mount = require('koa-mount')

var register = require('../lib/register');

var public_ = new Router();

module.exports = {

    login_mount: function(app) {

        app.use(bodyParser());

        // authentication
        require('../lib/auth');

        app.use(passport.initialize());
        app.use(passport.session());

        // public_ routes

        // POST /login
        public_.post('/login',
            passport.authenticate('local', {
                successRedirect: '/maboss',
                failureRedirect: '/login'
            })
        );

        public_.get('/logout', function * (next) {
            this.logout();
            this.redirect('/login');
        });

        //app.use(public_.middleware());
        
            var url_prefix = '/api'
            app.use(mount(url_prefix, public_.middleware()));
        
            logger.debug("app.pg:", this);
        
           // register.register_url(url_prefix, public_);

        // Require authentication for now
        app.use(function * (next) {           
            
            if (this.isAuthenticated()) {
                
                logger.debug("Authenticated");
                yield next
                
            } else {
                logger.debug("Not Authenticated");
                this.body = {"redirect":"/login"};
                //this.redirect('/login')
            }
        });
        
        // check rbac
        app.use(function * (next){
            
            logger.debug("Check RBAC"); 
            
            var username = this.session.passport.user.username;
            
            logger.debug(username);
            
           var sql = "select role from role where username = '"+ username +"'";
            
            logger.debug("sql:", sql);
            
            yield next;
            
        });

        return app;

    }


}
