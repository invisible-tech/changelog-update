'use strict'

const assertChangelogUpdate = require('./assertChangelogUpdate')
const generateChangelog = require('./generateChangelog')
const lastChangelogUpdate = require('./lastChangelogUpdate')
const pushChangelogUpdate = require('./pushChangelogUpdate')

module.exports = {
  assertChangelogUpdate,
  generateChangelog,
  lastChangelogUpdate,
  pushChangelogUpdate,
}
