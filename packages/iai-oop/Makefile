#!/bin/bash

#
# Input

# test files to be executed
TESTS=$(shell find test/ -name "*.js" | sort)
# input source code for report tools
LIB=index.js
# input source for document generator
DOC_IN=$(LIB)
# main file for document generator
DOC_MAIN=$(LIB)
#
# Output

#directory where reports are stored
REPORTS=reports
# browser to use when opening the reports
BROWSER=xdg-open

#
# Utils

# Path of node executables
BIN=$(shell npm bin)

# checks whatever a npm package is present
define ensure_npm_present
  @echo "\nEnsuring npm package '$1' is present..."\
  && npm ls $1 >/dev/null 2>&1 && echo "'$1' is present.\n"\
  || (\
    echo "'$1' not present.\nrun:\n    npm install $1 --save-dev\n"\
    && exit 1\
  )
endef

# checks whatever a system util is present
define ensure_apt_present
  @echo "\nEnsuring apt package '$1' is present..."\
  && type $1 >/dev/null 2>&1 && echo "'$1' is present.\n"\
  || (\
    echo "'$1' not present.\nrun:\n    apt-get install $1\n"\
    && exit 1\
  )
endef

# opens something in the browser
define open_in_browser
  @echo "Opening '$1' in the browser..." && $(BROWSER) $1
endef

all:
	$(info Plase specify an action)
	@exit

# directory where docs are stored once generated
DOC_DIR=docs
documentation:
	$(call ensure_npm_present,doxit)
	@echo "Generating documentation with doxit..."
	@$(BIN)/doxit\
          -i $(DOC_IN)\
          -I $(DOC_MAIN)\
          -o $(DOC_DIR)\
	  -t "$(shell basename $(shell pwd)) documentation"\
	  -T docs/index.jade\
	|| (echo "\nFail. See details above\n" && exit 1)
	$(call open_in_browser,$(DOC_DIR)/index.html)

gh-pages: test-once documentation
	@echo "Going to deploy gh-pages..."
	@git checkout gh-pages
	@git merge master
	@cp -r $(DOC_DIR)/* .
	@git add .
	@git commit -m "automatic commit for gh-pages deploy"\
	&& git push origin gh-pages\
	|| echo "\nThere are no changes\n"
	@git checkout master
	$(call open_in_browser,http://laconbass.github.io/iai-oop)

MOCHA=$(BIN)/mocha
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

# directory where complexity report is stored once generated
REPORT_CPX=$(REPORTS)/complexity
complexity: $(REPORTS)
	$(call ensure_npm_present,plato)
	@echo "Generating complexity report with plato..."
	@$(BIN)/plato -r -d $(REPORT_CPX) $(LIB) $(TESTS) >/dev/null 2>&1
	$(call open_in_browser,$(REPORT_CPX)/index.html)

#
# Inspired by (and modified from) a superb post found on
# http://sergimansilla.com/blog/test-coverage-node/

# directory where coverage report is stored once generated
REPORT_COV=$(REPORTS)/coverage
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
	@echo Generate coverage report with mocha-istanbul\
	 && ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	@make $(REPORTS)
	@echo Move coverage report to '$(REPORT_COV)/'\
	 && mv lcov.info $(REPORT_COV)/
	@echo Remove instrumented code && rm -rf $(LIB)
	@echo Restore original code && mv $(LIB)-orig $(LIB)
	@echo Generate html report\
	 && genhtml $(REPORT_COV)/lcov.info --output-directory $(REPORT_COV)/
	$(call open_in_browser,$(REPORT_COV)/index.html)

$(REPORTS): clean
	$(info Create '$(REPORTS)' directory)
	@mkdir -p $(REPORT_COV)
	@mkdir -p $(REPORT_CPX)


.PHONY: coverage clean test
