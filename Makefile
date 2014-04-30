BASE = .

TESTS = test/test_*.js
TIMEOUT = 10

install:
	npm install

win:
	npm install --msvs_version=2012

start:
	nodemon --harmony server.js

test:
	mocha -R spec
    
bower:
	bower install

component:
	component install

py.test:
	py.test
#	$(TESTS)
#	mocha  -R html-cov > coverage.html
help:
	@echo "'win' for installation on windows"
	@echo "dev with nodemon"

lint:
# set CYGWIN=nodosfilewarning
	jshint . --exclude backup --config .jshintrc

.PHONY: test start install install.win