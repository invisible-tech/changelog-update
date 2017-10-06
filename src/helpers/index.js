'use strict'

const spawn = require('cross-spawn')
const {
  filter,
  flow,
  join,
  map,
  negate,
  overEvery,
  split,
  startsWith,
  trim,
  trimCharsStart,
} = require('lodash/fp')

const { CHANGELOG_FILE } = require('../constants')

const getAdditions = flow(
  split('\n'),
  filter(overEvery([
    startsWith('+'),
    negate(startsWith('++')),
  ])),
  map(trimCharsStart('+')),
  join('\n'),
  trim,
)

const getLastChangelogAdditions = ({ changelogFile = CHANGELOG_FILE, commitHash = 'master' } = {}) => {
  const { stdout: diff } = spawn.sync(
    'git',
    [
      '--no-pager',
      'diff',
      `${commitHash}..HEAD`,
      '--minimal',
      '--unified=0',
      '--no-color',
      '--',
      changelogFile,
    ],
    { encoding: 'utf8' }
  )

  return getAdditions(diff)
}

module.exports = {
  getLastChangelogAdditions,
}
