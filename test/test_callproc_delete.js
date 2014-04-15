
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
   
 describe('call delete in callproc', function() {

        before(function(done){

            done();

        });

        after(function(done){

            done();

        });

        it('jsonrpc request call upsert should success', function(done){

            var url = 'http://127.0.0.1:6226/callproc.call';

            request.post(url, function(err, httpResponse, body) {
              
                //normal
                httpResponse.statusCode.should.equal(200);
                httpResponse.statusMessage.should.equal('OK');

                //console.log(url);
                //console.log(body);
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
