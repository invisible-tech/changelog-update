#!/usr/bin/env node

'use strict'

const assert = require('assert')
const got = require('got')
const { stripIndents } = require('common-tags')
const {
  includes,
  toLower,
  trimChars,
} = require('lodash/fp')

const {
  lastChangelogUpdate,
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

const postToSlack = async ({
  changelogFile = CHANGELOG_FILE,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
} = {}) => {
  const text = lastChangelogUpdate({ changelogFile })
  const payload = JSON.stringify({
    icon_emoji: normalizeEmoji(iconEmoji),
    text,
    username: slackbotName,
  })
  return postToWebhook({ payload, webhookUrl })
}

const postToDiscord = async ({
  changelogFile = CHANGELOG_FILE,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
} = {}) => {
  const text = lastChangelogUpdate({ changelogFile })
  const payload = JSON.stringify({
    content: stripIndents`
      ${normalizeEmoji(iconEmoji)}
      ${text}
    `,
    username: slackbotName,
  })
  return postToWebhook({ payload, webhookUrl })
}

const run = async ({
  changelogFile = CHANGELOG_FILE,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
}) => {
  assert(webhookUrl, 'changelog-update: no webhook url given')
  if (includes('slack')(process.env.CHANGELOG_WEBHOOK_URL)) {
    return postToSlack({
      changelogFile,
      iconEmoji,
      slackbotName,
      webhookUrl,
    })
  }

  if (includes('discord')(process.env.CHANGELOG_WEBHOOK_URL)) {
    return postToDiscord({
      changelogFile,
      iconEmoji,
      slackbotName,
      webhookUrl,
    })
  }
}

module.exports = run
