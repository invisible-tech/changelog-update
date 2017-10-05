'use strict'

const spawn = require('cross-spawn')
const {
  filter,
  flow,
  join,
  last,
  map,
  negate,
  overEvery,
  split,
  startsWith,
  trim,
  trimCharsStart,
} = require('lodash/fp')

const { CHANGELOG_FILE } = require('../constants')

const MASTER = 'master'

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

const currentBranch = () =>
  spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).stdout

const lastMergeHash = () => {
  const { stdout: mergeHashes } = spawn.sync(
    'git',
    [
      '--no-pager',
      'log',
      '--merges',
      '-2',
      '--pretty=format:%h',
    ],
    { encoding: 'utf8' }
  )

  return last(split('\n')(mergeHashes))
}

const changelogCommitHash = () =>
  (currentBranch() === MASTER ? lastMergeHash() : MASTER)

const lastChangelogUpdate = ({ changelogFile = CHANGELOG_FILE, commitHash } = {}) => {
  const { stdout: diff } = spawn.sync(
    'git',
    [
      '--no-pager',
      'diff',
      `${commitHash || changelogCommitHash()}..HEAD`,
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
  lastChangelogUpdate,
}
