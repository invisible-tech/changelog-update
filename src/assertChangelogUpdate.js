'use strict'

const assert = require('assert')
const { includes } = require('lodash/fp')

const {
  currentBranch,
  changelogCommitHash,
  lastChangelogUpdate,
} = require('./helpers')
const { CHANGELOG_FILE } = require('./constants')

const IGNORED_BRANCHES = ['master', 'production', 'staging']
const shouldIgnore = branch => includes(branch)(IGNORED_BRANCHES)

const run = ({ changelogFile = CHANGELOG_FILE } = {}) => {
  if (shouldIgnore(currentBranch())) return
  const additions = lastChangelogUpdate({ changelogFile })
  const hash = changelogCommitHash()
  assert(additions, `changelog-update: no additions to ${changelogFile} found since ${hash}`)
}

module.exports = run
