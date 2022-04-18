const fs = require('fs');
const path = process.argv[3];
const package = require(path + '/package.json');
const currentVersion = package.version;
const nextVersion = process.argv[2].trim().replace(/\'/g, '"');

if (!nextVersion || nextVersion === currentVersion) {
  throw new Error('Next version is not defined or is a version that already exists');
}

// Returns -1 if first is less than second, 1 if first is greater than second, otherwise 0 if equal.
function compareVersion(first, second) {
  // Assumption: only numbers in our versions.
  const firstParts = first.split('.').map((value) => parseInt(value));
  const secondParts = second.split('.').map((value) => parseInt(value));

  for (let i = 0; i < firstParts.length; i++) {
    if (secondParts.length === i) {
      return 1;
    }

    if (firstParts[i] < secondParts[i]) {
      return -1;
    } else if (firstParts[i] > secondParts[i]) {
      return 1;
    }
  }

  if (firstParts.length !== secondParts.length) {
    return -1;
  }

  return 0;
}

if (compareVersion(currentVersion, nextVersion) <= 0) {
  package.version = nextVersion;
  fs.writeFileSync(path + '/package.json', JSON.stringify(package, null, 2));
}
