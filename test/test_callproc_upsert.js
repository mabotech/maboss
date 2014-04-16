
// npm install Faker
var Faker = require('Faker');

// npm install request
var request = require('request');

// npm install should
var should = require("should");

var nconf = require('nconf');

nconf.file('test_config.json');

var root = nconf.get('root');

var get_word = function(maxlen){
    var companyName = Faker.Company.companyName();
    if (companyName.length > maxlen){
        return companyName.substring(0, maxlen);
    }else{
        return companyName;
    }
};

describe('maboss', function() {
   
 describe('app', function() {
        it('pgtime should success', function(done){

            var url = root+'/callproc.pgtime';
            console.log(url);
            request.post(url, function(err, httpResponse, body) {

                console.log(url);
                console.log(body);
                //body.should.equal('Not Found');
                done();
            });

        });

    });
    /*
     *
     */
    describe('callproc', function() {
        it('call upsert should success', function(done){

            var url = root+'/callproc.call';

            request.post(url, function(err, httpResponse, body) {
               
                //normal
                httpResponse.statusCode.should.equal(200);
                httpResponse.statusMessage.should.equal('OK');

                console.log(url);
                console.log(body);
                //body.should.equal('Not Found');
                done();
            }).form(
                    {
                        "jsonrpc":"2.0",
                        "id":"r2",
                        "method":"mtp_upsert_cf4",
                        "params":
                        {
                            "table":"company", 
                            "columns":{
                                "company":get_word(4),
                                "texths":"ab'c",//get_word(20),
                                "currencycode":get_word(3),
                                "domainmanagerid":Faker.random.number(1100),
                                "objectclass":get_word(40)            
                            },
                           "context":{"user":Faker.Name.firstName(), "languageid":"1033", "sessionid":"123" } 
                       }
                    }
                );

        });

    });//end describe

describe('callproc', function() {
        it('jsonrpc request call upsert should success', function(done){

            var url = root+'/callproc.call';

            request.post(url, function(err, httpResponse, body) {
              
                //normal
                httpResponse.statusCode.should.equal(200);
                httpResponse.statusMessage.should.equal('OK');

                console.log(url);
                console.log(body);
                //body.should.equal('Not Found');
                done();
            }).form(
                    {
                        "jsonrpc":"2.0",
                        "id":"r3",
                        "method":"mtp_upsert_cf4",
                        "params":
                        {
                            "table":"company", 
                            "columns":{
                                "company":get_word(4),
                                "texths":get_word(10),
                                "currencycode":get_word(3),
                                "domainmanagerid":Faker.random.number(1100),
                                "objectclass":get_word(40)            
                            },
                           "context":{"user":Faker.Name.firstName(), "languageid":"1033", "sessionid":"123" } 
                       }
                    }
                );

        });

    });//end describe
        

});
