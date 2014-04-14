
// npm install Faker
var Faker = require('Faker');

// npm install request
var request = require('request');

// npm install should
var should = require("should");

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
        //pass parameter done when do call async method.
        it('faker should success', function(done) {
            
            var firstName = Faker.Name.firstName();
            console.log(firstName);
            
            var userName = Faker.Internet.userName();
            console.log(userName);

            var color1 = Faker.Internet.color(1);
            console.log(color1);

            var companyName = Faker.Company.companyName();
            console.log(companyName);

            var recent = Faker.Date.recent(10);
            console.log(recent);

            var past = Faker.Date.past(1);
            console.log(past);

            var number = Faker.random.number(110);
            console.log(number);

            done();
        });

    });
     /*
     *
     */
    describe('app', function() {
        it('pgtime should success', function(done){

            var url = 'http://127.0.0.1:6226/callproc.pgtime';

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

            var url = 'http://127.0.0.1:6226/callproc.call';

            request.post(url, function(err, httpResponse, body) {

                console.log(err);
                
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
        it('call upsert should success', function(done){

            var url = 'http://127.0.0.1:6226/callproc.call';

            request.post(url, function(err, httpResponse, body) {

                console.log(err);
                
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
