var winston = require('winston');

var logger = winston.loggers.get('app_debug');

var Router = require('koa-router')

var pub = new Router()

pub.get('/', function*() {
  this.body = "ok";//yield this.render('login')
})

pub.post('/custom', function*(next) {
  var ctx = this
  yield passport.authenticate('local', function*(err, user, info) {
    if (err) throw err
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      yield ctx.login(user)
      ctx.body = { success: true }
    }
  }).call(this, next)
})

// POST /login
pub.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

pub.get('/logout', function*(next) {
  this.logout()
  this.redirect('/')
})