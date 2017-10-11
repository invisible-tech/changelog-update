'use strict'

const assert = require('assert')
const { includes } = require('lodash/fp')

const {
  changelogCommitHash,
  lastChangelogUpdate,
} = require('./helpers')
const { CHANGELOG_FILE } = require('./constants')

const { CIRCLE_BRANCH } = process.env
const IGNORED_BRANCHES = ['master', 'production', 'staging']
const shouldIgnore = branch => includes(branch)(IGNORED_BRANCHES)

const run = ({ changelogFile = CHANGELOG_FILE } = {}) => {
  if (shouldIgnore(CIRCLE_BRANCH)) return
  const additions = lastChangelogUpdate({ changelogFile })
  const hash = changelogCommitHash()
  assert(additions, `changelog-update: no additions to ${changelogFile} found since ${hash}`)
}

module.exports = run
