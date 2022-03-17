#!/bin/bash

set -e

# Run the build and copy to the rive-react-webgl build for npm release
npm run build
cp -r ./dist ./npm/rive-react-webgl
cp -r ./dist ./npm/rive-react-canvas

echo Replacing the webgl with canvas references
pushd ./npm/rive-react-canvas/dist
if [[ "$OSTYPE" == "darwin"* ]]; then
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/webgl/@rive-app\/canvas/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/webgl/@rive-app\/canvas/g'
else
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i -e 's/@rive-app\/webgl/@rive-app\/canvas/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i -e 's/@rive-app\/webgl/@rive-app\/canvas/g'
fi
popd
