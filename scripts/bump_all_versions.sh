#!/bin/bash
set -e

# Bump the version number of every npm module in the npm folder.
for dir in ./npm/*; do
    pushd $dir > /dev/null
    repo_name=`echo $dir | sed 's:.*/::' | sed 's/_/-/g'`
    echo Bumping version of $repo_name
    ../../scripts/bump_version.sh $repo_name $RELEASE_VERSION
    popd > /dev/null
done
