const findUp = require('find-up')
const fs = require('fs')

const NAMESPACE = 'vitus-labs'
const PKG_NAMESPACE = `@${NAMESPACE}/`

const findFile = (filename) => findUp.sync(filename, { type: 'file' })
const findFilePath = (filename) => findFile(filename).replace(filename, '')

const getPackageInfo = (key) => {
  const file = fs.readFileSync(findFile('package.json')).toString('utf8')

  try {
    const json = JSON.parse(file)
    const result = key ? json[key] : json

    if (['peerDependencies', 'dependencies', 'devDependencies'].includes(key)) {
      return Object.keys(result || {})
    }

    return result
  } catch (e) {
    console.log(e)
  }

  return ''
}

const getPackageName = () => getPackageInfo('name')
const getPackageDependencies = () => getPackageInfo('dependencies')
const getPackagePeerDependencies = () => getPackageInfo('peerDependencies')

module.exports = {
  findFile,
  findFilePath,
  NAMESPACE,
  PKG_NAMESPACE,
  ROOT_DIR: findFilePath('.projectRoot'),
  PKG_ROOT: findFilePath('package.json'),
  PKG_NAME: getPackageName(),
  PKG_NAME_WITHOUT_PREFIX: getPackageName().replace(PKG_NAMESPACE, ''),
  PKG_DEPENDENCIES: getPackageDependencies(),
  PKG_PEER_DEPENDENCIES: getPackagePeerDependencies(),
}
