#!/bin/bash
set -e

# Bump the version number of every npm module in the npm folder.
for dir in ./npm/*; do
    pushd $dir > /dev/null
    echo Publishing `echo $dir | sed 's:.*/::'`
    npm publish --access public
    popd > /dev/null
done
