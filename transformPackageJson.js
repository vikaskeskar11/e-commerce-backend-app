// Transform package.json such that only dependencies remains
const fs = require('fs')
const packageJson = JSON.parse(fs.readFileSync('package.json'))
const keepAttributes = ['name', 'dependencies', 'devDependencies']
for (const attribute in packageJson) {
  if (keepAttributes.indexOf(attribute) < 0) {
    delete packageJson[attribute]
  }
}
const jsonFileContent = JSON.stringify(packageJson, null, 2)
fs.writeFileSync('package-docker.json', jsonFileContent)
