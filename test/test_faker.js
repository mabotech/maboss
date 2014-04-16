
// npm install Faker
var Faker = require('Faker');

// npm install request
var request = require('request');



// npm install should
var should = require("should");

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
    
});
