var request = require('request');

var should = require("should");

var nconf = require('nconf');

nconf.file('test_config.json');

var root = nconf.get('root');

describe('maboss', function() {
    describe('poc', function() {
        //pass parameter done when do call async method.
        it('notfound should be true', function(done) {

            var start = new Date();

            var url = root+'/poc.notfound';
            request.post(url, function(err, httpResponse, body) {

                console.log(url);
                body.should.equal('Not Found');
                httpResponse.statusMessage.should.equal('Not Found');
                //httpResponse.headers['content-type'].should.equal('application/json');
                httpResponse.statusCode.should.equal(404);

                //JSON.parse(body).jsonrpc.should.equal("2.0");

                //(err == null).should.be.true;

                if (err) {
                    return console.error('failed:', err);
                }

                done();
            }).form({});

        });
    });

    describe('poc', function() {
        it('test should get status code 500', function(done) {

            var start = new Date();
            var url = root+'/poc.test';

            request.post(url, function(err, httpResponse, body) {

                if (err) {
                    return console.error('failed:', err);
                }
                console.log(url);
                body.should.equal('error in poc');
                httpResponse.statusMessage.should.equal('Internal Server Error');

                //httpResponse.headers['content-type'].should.equal('application/json');
                httpResponse.statusCode.should.equal(500);

                done();
            }).form({
                key: 'value',
                attr: {
                    'name': 'tobi'                  
                }
            });

        });
    });

    after(function() {

        //console.log("after")
    });

});
