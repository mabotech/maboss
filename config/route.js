/*
 *
 */

var _ = require('koa-route');

/*
 * load apps
 */

var portal = require('../app/portal');
var dataset = require('../app/dataset');
var callproc = require('../app/callproc');
var user = require('../app/user')


module.exports = {

    add: function(app) {

        /*
         * route
         */
        app.use(_.get('/', portal.show));

        app.use(_.post('/fetch', dataset.fetch));

        app.use(_.post('/work', dataset.work));

        app.use(_.post('/callproc', callproc.test));

        //console.log(Object.keys(app));
        //console.log(Functioins.keys(app));

        /*
         * rest demo
         */
        /*
		app.use(_.get('/user/:name', user.get));
		app.use(_.get('/user', user.list));
		app.use(_.post('/user', user.save));
		app.use(_.put('/user', user.update));
		app.use(_.delete('/user', user.delete));
		*/

        return app;

    }

};
