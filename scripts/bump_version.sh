#!/bin/bash

# Bumps the version of a single npm module found in the current working
# directory. Call bump_version.sh from the path with package.json in it.

set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
NPM_VERSIONS=`npm show rive-react versions`
node $SCRIPT_DIR/nextVersion.js "$NPM_VERSIONS" `pwd`
