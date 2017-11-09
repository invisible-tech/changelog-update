'use strict'

const { lastChangelogUpdate } = require('./helpers')
const { CHANGELOG_FILE } = require('./constants')

const run = ({ changelogFile = CHANGELOG_FILE, commitHash } = {}) =>
  lastChangelogUpdate({ changelogFile, commitHash })

module.exports = run
