#!/bin/bash

#
# Node executables

BIN=$(shell npm bin)
MOCHA=$(BIN)/mocha

#
# Inputs

# test files to be executed
TESTS=$(shell find test/ -name "*.js" | sort)
# input source code for report tools
LIB=lib

#
# Reports

#directory where reports are stored
REPORTS=reports
# directory where coverage report is stored once generated
REPORT_COV=$(REPORTS)/coverage
# directory where complexity report is stored once generated
REPORT_CPX=$(REPORTS)/complexity
# browser to use when opening the reports
BROWSER=google-chrome

#
# Utils

# checks whatever a system util is present
define ensure_apt_present
  @echo ""\
  && echo "Ensuring apt package '$1' is present..."\
  && type $1 >/dev/null 2>&1\
  && echo "'$1' is present."\
  || (
    echo ""\
    && echo "'$1' not present."\
    && echo "run:"\
    && echo "    apt-get install $1"\
    && echo ""\
    && exit 1\
  )
endef

# checks whatever a npm package is installed
define ensure_npm_present
  @echo ""\
  && echo "Ensuring npm package '$1' is present..."\
  && npm ls $1 >/dev/null 2>&1\
  && echo "npm package '$1' is present."\
  || (\
    echo "npm package '$1' not present."\
    && echo "run:"\
    && echo "    npm install $1 --save-dev"\
    && echo ""\
    && exit 1\
  )
endef

all:
	$(info Plase specify an action)
	@exit

test:
	@$(MOCHA) -R min --bail --watch $(TESTS)

test-once:
	@echo Ensure all tests succeed\
	 && $(MOCHA) -R progress --bail $(TESTS)\
	 || (echo Some test did not succeed && exit 1)

test-files:
	@echo $(TESTS) | tr " " "\n"

pending:
	@$(MOCHA) -R mocha-pending $(TESTS) | more

clean:
	@echo "Delete '$(REPORTS)' directory" && rm -rf $(REPORTS)

$(REPORTS): clean
	$(info Create '$(REPORTS)' directory)
	@mkdir $(REPORTS)

complexity: $(REPORTS)
	$(call ensure_npm_present,plato)
	@echo "Generating complexity report with plato..."
	@$(BIN)/plato -r -d $(REPORT_CPX) $(LIB) $(TESTS) >/dev/null 2>&1
	@echo "Opening report in $(BROWSER)..."
	@$(BROWSER) $(REPORT_CPX)/index.html

#
# Inspired by a superb post found on
# http://sergimansilla.com/blog/test-coverage-node/
#
coverage: test-once $(REPORTS)
	$(call ensure_apt_present,lcov)
	$(call ensure_npm_present,istanbul)
	$(call ensure_npm_present,mocha-istanbul)
	@echo Instrument code with istanbul\
	 && $(BIN)/istanbul instrument --output $(LIB)-cov $(LIB)
	@echo Backup original code to '$(LIB)-orig'\
	 && mv $(LIB) $(LIB)-orig
	@echo Replace $(LIB) width instrumented code\
	 && mv $(LIB)-cov $(LIB)
	@echo Generate coverage report with istanbul\
	 && ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	@make $(REPORTS)
	@echo Move coverage report to '$(REPORT_COV)/'\
	 && mv lcov.info $(REPORT_COV)/
	@echo Remove instrumented code && rm -rf $(LIB)
	@echo Restore original code && mv $(LIB)-orig $(LIB)
	@echo Generate html report\
	 && genhtml $(REPORT_COV)/lcov.info --output-directory $(REPORT_COV)/
	@echo Opening coverage report...\
	 && $(BROWSER) $(REPORT_COV)/index.html

.PHONY: coverage clean test show-test-files
