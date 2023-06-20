#!/bin/bash
set -e

echo "Copying package.json to rive-react npm package folders"

# Bump the version number of every npm module in the npm folder.
for dir in ./npm/*; do
    echo $dir
    pushd $dir > /dev/null
    echo $dir
    if [ -f "./package.json" ]; then
        echo "Removing existing package.json..."
        rm "./package.json"
        echo "package.json deleted from $dir"
    fi
    cp ../../package.json ./
    repo_name=`echo $dir | sed 's:.*/::' | sed 's/_/-/g'`
    echo Setting package.json on npm packages
    echo $repo_name
    ../../scripts/setup_package.sh $repo_name
    echo Finished setting up package.json
    popd > /dev/null
done

