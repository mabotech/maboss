

var winston = require('winston');
var logger = winston.loggers.get('router');

var bodyParser = require('koa-bodyparser');
var passport = require('koa-passport');

var Router = require('koa-router');

var public_area = new Router();

module.exports = {
    
    login_mount:  function(app){
        
        
        

app.use(bodyParser());

// authentication
require('../lib/auth');

app.use(passport.initialize());
app.use(passport.session());

// public_area routes

/*
// append view renderer
var views = require('koa-render')
app.use(views('./views', {
  map: { html: 'handlebars' },
  cache: false
}))

public_area.get('/api/abc', function*() {
  this.body = yield this.render('login')
})

*/
// POST /login
public_area.post('/api/login',
  passport.authenticate('local', {
    successRedirect: '/maboss',
    failureRedirect: '/login'
  })
)

public_area.get('/api/logout', function*(next) {
  this.logout()
  this.redirect('/login')
})

app.use(public_area.middleware())

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
      logger.debug("Authenticated");
    yield next
  } else {
       logger.debug("Not Authenticated");
    this.redirect('/login')
  }
})
        
        return app;
        
        }   
    
    
}