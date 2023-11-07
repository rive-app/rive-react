#!/bin/bash

set -e

# Copy the build to each react-variant build for npm release
cp -r ./dist ./npm/react-webgl
cp -r ./dist ./npm/react-canvas
cp -r ./dist ./npm/react-canvas-lite

echo "Replacing the canvas with webgl references in react-webgl"
pushd ./npm/react-webgl/dist
if [[ "$OSTYPE" == "darwin"* ]]; then
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/canvas/@rive-app\/webgl/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/canvas/@rive-app\/webgl/g'
else
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i -e 's/@rive-app\/canvas/@rive-app\/webgl/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i -e 's/@rive-app\/canvas/@rive-app\/webgl/g'
fi
popd

echo "Replacing the canvas with canvas-lite references in react-canvas-lite"
pushd ./npm/react-canvas-lite/dist
if [[ "$OSTYPE" == "darwin"* ]]; then
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/canvas/@rive-app\/canvas-lite/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e 's/@rive-app\/canvas/@rive-app\/canvas-lite/g'
else
  find . -type f -name "*.ts" -print0 | xargs -0 sed -i -e 's/@rive-app\/canvas/@rive-app\/canvas-lite/g'
  find . -type f -name "*.js" -print0 | xargs -0 sed -i -e 's/@rive-app\/canvas/@rive-app\/canvas-lite/g'
fi
popd
