#!/bin/bash

# modified from a superb post found on http://sergimansilla.com/blog/test-coverage-node/

# node executables locally installed
MOCHA=node_modules/.bin/mocha
ISTANBUL=node_modules/.bin/istanbul

# test files to be executed
TESTS=$(shell find test/ -name "*.js" | sort)
# directory where coverage report is stored once generated
REPORTS="coverage-report"

default:
	@echo "Specify an action."
	@exit 1

coverage:
	@echo "Ensuring all tests succeed..."
	@make test-once || (echo "Some test did not succeed. Abort" && exit 1)
	@echo "Ensuring lcov is present..."
	@type lcov >/dev/null 2>&1\
	 && echo "lcov present."\
	 || (echo "lcov not present.\nrun apg-get install lcov" && exit 1)
	@echo "Going to instrument code with istanbul..."
	@$(ISTANBUL) instrument --output lib-cov lib
	@echo "Generating coverage report with istanbul..."
	@mv lib lib-orig && mv lib-cov lib
	@ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	@echo "Moving report to '$(REPORTS)' and removing instrumented code..."
	@test -d $(REPORTS) || mkdir $(REPORTS)
	@mv lcov.info $(REPORTS)/
	@rm -rf lib
	@mv lib-orig lib
	@echo "Generating html report..."
	@genhtml $(REPORTS)/lcov.info --output-directory $(REPORTS)/
	@echo "Opening html report..."
	@google-chrome $(REPORTS)/index.html

clean:
	@echo "Deleting '$(REPORTS)' directory"
	@rm -rf $(REPORTS)

test:
	@$(MOCHA) -R min --bail --watch $(TESTS)

test-once:
	@$(MOCHA) -R progress --bail $(TESTS)

show-test-files:
	@echo $(TESTS) | tr " " "\n"

.PHONY: coverage clean test show-test-files
