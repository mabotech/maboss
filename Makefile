TESTS = test/test_*.js
TIMEOUT = 10

start:
	nodemon --harmony server.js

test:
	mocha -R spec
#	$(TESTS)
#	mocha  -R html-cov > coverage.html

.PHONY: test start