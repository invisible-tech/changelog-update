#!/usr/bin/env node

'use strict'

const assert = require('assert')
const got = require('got')
const {
  toLower,
  trimChars,
} = require('lodash/fp')

const {
  lastChangelogAdditions,
} = require('./helpers')
const {
  CHANGELOG_FILE,
  ICON_EMOJI,
  SLACKBOT_NAME,
} = require('./constants')

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
  const text = lastChangelogAdditions({
    changelogFile,
  })
  const payload = JSON.stringify({
    icon_emoji: normalizeEmoji(iconEmoji),
    text,
    username: slackbotName,
  })
  return postToWebhook({ payload, webhookUrl })
}

module.exports = run
