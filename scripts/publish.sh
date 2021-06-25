#!/bin/bash
set -e
NPM_VERSIONS=`npm show rive-react versions --json`
node ./scripts/next_version.js "$NPM_VERSIONS"
npm publish