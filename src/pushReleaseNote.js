#!/usr/bin/env node

'use strict'

const assert = require('assert')
const got = require('got')
const spawn = require('cross-spawn')
const {
  last,
  split,
  toLower,
  trimChars,
} = require('lodash/fp')

const { getLastChangelogAdditions } = require('./helpers')
const {
  CHANGELOG_FILE,
  ICON_EMOJI,
  SLACKBOT_NAME,
} = require('./constants')

const getLastMergeHash = () => {
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

const postToWebhook = async ({ payload, webhookUrl }) => {
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload),
    },
    method: 'POST',
    body: payload,
  }
  return got(webhookUrl, options)
}

const normalizeEmoji = str => `:${trimChars(':')(toLower(str))}:`

const run = async ({
  changelogFile = CHANGELOG_FILE,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
}) => {
  assert(webhookUrl, 'release-note: no webhook url given')
  const text = getLastChangelogAdditions({
    changelogFile,
    commitHash: getLastMergeHash(),
  })
  const payload = JSON.stringify({
    icon_emoji: normalizeEmoji(iconEmoji),
    text,
    username: slackbotName,
  })
  return postToWebhook({ payload, webhookUrl })
}

module.exports = run
