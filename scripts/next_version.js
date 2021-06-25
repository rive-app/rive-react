const fs = require('fs');
const package = require('../package.json');

function parseVersion(v) {
  return v.split('.').map((n) => Number.parseInt(n, 10));
}

const packageVersion = parseVersion(package.version);
// Last version seems to always be latest.
const publishedVersion = parseVersion(JSON.parse(process.argv[2]).pop());

const isGreater = (first, second) => {
  // Assumes first and second have same number of version number
  const zipped = first.map((n, i) => [n, second[i]]);
  return zipped.some(([a, b]) => a > b);
};

// If package version is greater than what's published, we use that.
if (isGreater(packageVersion, publishedVersion)) {
  return;
}

// Otherwise increment the publishedVersions patch number and push to the package.json
const newVersion = publishedVersion;
newVersion[2]++;
package.version = newVersion.join('.');
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
