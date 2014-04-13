var Faker = require('Faker');

var request = require('request');

var should = require("should");

describe('maboss', function() {
    describe('app', function() {
        //pass parameter done when do call async method.
        it('faker should success', function(done) {
            var randomName = Faker.Name.findName();
            console.log(randomName);
            done();

        });

    });

});
