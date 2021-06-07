.PHONY: build-NodeLayer compile

build-NodeLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes don't relate to dependencies

zip:
	find .rollup -type f -name '*.js' -exec bash -c 'zip -j "${1%.js}".zip "$1"' _ {} \;

compile:
	npm run build && npm run rollup

layers:
	ARTIFACTS_DIR=layers make build-NodeLayer

build-package:
	$(MAKE) compile
	$(MAKE) layers
