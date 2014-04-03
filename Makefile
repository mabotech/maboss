TESTS = test/test_*.js
TIMEOUT = 10

test:
	mocha -R spec
#	$(TESTS)
#	mocha  -R html-cov > coverage.html

.PHONY: test