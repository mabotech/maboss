var request = require('request');

var should = require("should");

var nconf = require('nconf');

nconf.file('./test_config.json');

var root = nconf.get('root');

describe('maboss', function() {
    describe('app', function() {
        //pass parameter done when do call async method.
        it('root should success', function(done) {

            var start = new Date();

            var url = root;
            request.get(url, function(err, httpResponse, body) {

                console.log(url);
                //body.should.equal('Not Found');
                //httpResponse.statusMessage.should.equal('Not Found');
                httpResponse.headers['content-type'].should.equal('application/json');
                //httpResponse.statusCode.should.equal(404);

                JSON.parse(body).jsonrpc.should.equal("2.0");

                //(err == null).should.be.true;

                if (err) {
                    return console.error('failed:', err);
                }

                done();
            });

        });
    });

    describe('app', function() {
        it('work should success', function(done) {

            var start = new Date();
            var url = root+'/work';

            request.post(url, function(err, httpResponse, body) {

                /*
                ms = new Date() - start;
                console.log(url_dbfunc);
                console.log(ms);
                */
                //(err === null).should.be.true;
                if (err) {
                    return console.error('failed:', err);
                }
                //throw("err");
                console.log(url);
                //body.should.equal('some error');
                //httpResponse.statusMessage.should.equal('Internal Server Error');

                httpResponse.headers['content-type'].should.equal('application/json');
                //httpResponse.statusCode.should.equal(500);

                done();
            }).form({
                key: 'value',
                attr: {
                    'name': 'tobi',
                    'info': {
                        "time": start.toISOString()
                    }
                }
            });

        });
    });

    after(function() {

        //console.log("after")
    });

});
