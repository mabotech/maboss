

maboss development environment and api.

## Environment

- nodejs, 0.11.12
- postgresql, 9.3.3
- plv8, 1.3
- redis, 2.6
- python, 2.7

## Tools
- npm
- git
- nssm
- scite
- mocha
- py.test
- jshint / jshint
- cygwin64, make

## API

### JSONRPC

jsonrpc

### request

	{"jsonrpc":"2.0",
	"method",
	"id":"r1",
	"params":[]
	}

#### upsert

insert / update

params(upsert):

        params= {"table":"company", 
            "columns":{
                "company":get_word(4),
                "texths":"hstore('1033',get_word())",
                "currencycode":get_word(3),
                "domainmanagerid":self.fake.random_int(),
                "objectclass":get_word(40)            
            },
           "context":{"user":self.fake.first_name(), "languageid":"1033", "sessionid":"123" } }

#### delete
logic delete

#### find
filter, sort,

### response

result

	{"jsonrpc":"2.0",
	"result":object,
	"id":"r1"
	}

error

	{"jsonrpc":"2.0",
	"error":"",
	"id":"r1"
	}

## Debug

on windows: `set DEBUG = koa, koa-route`

koa-route vs koa-router

note: koa-route is OK currently. 


### nodemon

configure file: `nodemon.json`


### jshint

configure `.jshintrc`

run:

`make lint`

set CYGWIN=nodosfilewarning

### mocha

mocha -R spec


### Faker

npm install Faker


## Test



`v0.0.1`