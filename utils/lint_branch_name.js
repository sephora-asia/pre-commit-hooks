const { exec } = require('child_process')
const { rules } = require('@commitlint/config-conventional')
const types = rules['type-enum'][2]

module.exports = init()

async function init() {
  try {
    const gitBranch = await _getGitBranch()
    const isValidGitBranch = _isValidGitBranch(gitBranch)

    if (isValidGitBranch) {
      return
    }

    const msg = `
      '${gitBranch}' is an invalid branch!
      Branch names must have a prefix of one of the following:
      \t${
        types
          .map(type => `- ${type}`)
          .join('\n\t')
      }
    `
    console.log(msg)

    process.exit(1)
  } catch (ex) {
    console.log(' ex: ', ex)
  }
}

function _isValidGitBranch(gitBranch) {
  types.push('main')
  return types.some(type => gitBranch.includes(type))
}

function _getGitBranch() {
  return new Promise((resolved, rejected) => {
    return exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (err) {
        rejected(`getBranch Error: ${err}`)
      } else if (typeof stdout === 'string') {
        resolved(stdout.trim())
      }
    })
  })
}
