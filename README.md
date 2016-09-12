# DiagramJS


## Prerequisites

Make sure you have [NodeJS](nodejs.org) and [npm](https://www.npmjs.org/doc/cli/npm.html) installed before you continue.


## Install dependencies

	npm install


## Building

	# bundleing to build/diagram.js with sourcemaps. not minified. ES6
	npm run build-dev

	# building and rebuilding on file changes
	npm run build-watch

	# bundles a minified diagram.js and css in a standalone html file. transpiled to ES5
	# ! - not yet fully implemented - !
	npm run build-prod
