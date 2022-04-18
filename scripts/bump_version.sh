#!/bin/bash

# Bumps the version of a single npm module found in the current working
# directory. Call bump_version.sh from the path with package.json in it.

set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# RELEASE_VERSION will come from an env variable passed in from the GH action workflow
node $SCRIPT_DIR/nextVersion.js "$RELEASE_VERSION" `pwd`
