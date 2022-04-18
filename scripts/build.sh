#!/bin/bash

set -e

# Run the build and copy to each react-variant build for npm release
npm run build
cp -r ./dist ./npm/react-webgl
cp -r ./dist ./npm/react-canvas

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
