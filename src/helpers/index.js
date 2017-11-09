'use strict'

const spawn = require('cross-spawn')
const finder = require('find-package-json')
const {
  filter,
  flow,
  get,
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

const {
  CHANGELOG_FILE,
  ICON_EMOJI,
  MASTER,
  ORIGIN_MASTER,
  SLACKBOT_NAME,
} = require('../constants')

const pkg = finder().next().value || {}

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

const currentBranch = () => {
  const { stdout: branch } = spawn.sync(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    { encoding: 'utf8' }
  )
  return trim(branch)
}

const lastMergeHash = () => {
  const { stdout: mergeHashes } = spawn.sync(
    'git',
    ['--no-pager', 'log', '--merges', '-2', '--pretty=format:%h'],
    { encoding: 'utf8' }
  )

  return trim(last(split('\n')(mergeHashes)))
}

const changelogCommitHash = () => {
  const { masterBranch, remoteMasterBranch } = getArgumentsWithDefaults()
  return (currentBranch() === masterBranch) ? lastMergeHash() : remoteMasterBranch
}

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

const getArgumentsWithDefaults = () => {
  const {
    changelogUpdate: {
      changelogFile = CHANGELOG_FILE,
      iconEmoji = ICON_EMOJI,
      masterBranch = MASTER,
      remoteMasterBranch = ORIGIN_MASTER,
    } = {},
  } = pkg

  const slackbotName = get('changelogUpdate.slackbotName')(pkg) ||
    get('name')(pkg) ||
    SLACKBOT_NAME

  return {
    changelogFile,
    iconEmoji,
    masterBranch,
    remoteMasterBranch,
    slackbotName,
  }
}

module.exports = {
  getArgumentsWithDefaults,
  changelogCommitHash,
  currentBranch,
  lastChangelogUpdate,
}
