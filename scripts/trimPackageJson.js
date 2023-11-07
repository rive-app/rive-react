const fs = require('fs');
const path = process.argv[2];
const npmPackageSplit = process.argv[3].split('-');
// extracts "webgl" or "canvas-lite" from the npm package name
const renderer = npmPackageSplit.slice(1).join('-');
const package = require(path + '/package.json');

function trimNpmPackage() {
  package.name = `@rive-app/react-${renderer}`;
  package.description = `React wrapper around the @rive-app/${renderer} library`;
  const webDependencyName = `@rive-app/${renderer}`;
  const canvasDep = package.dependencies[webDependencyName];
  package.dependencies = {
    [webDependencyName]: canvasDep,
  };
  delete package.devDependencies;
  delete package.scripts;
  fs.writeFileSync(path + '/package.json', JSON.stringify(package, null, 2));
}

if (renderer) {
  trimNpmPackage();
}
