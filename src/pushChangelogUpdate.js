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
  generateChangelog,
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
  text,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
} = {}) => {
  const payload = JSON.stringify({
    icon_emoji: normalizeEmoji(iconEmoji),
    text,
    username: slackbotName,
  })
  return postToWebhook({ payload, webhookUrl })
}

const postToDiscord = async ({
  text,
  iconEmoji = ICON_EMOJI,
  slackbotName = SLACKBOT_NAME,
  webhookUrl,
} = {}) => {
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
  generate,
}) => {
  assert(webhookUrl, 'changelog-update: no webhook url given')
  const text = generate
    ? generateChangelog()
    : lastChangelogUpdate({ changelogFile })

  if (includes('slack')(process.env.CHANGELOG_WEBHOOK_URL)) {
    return postToSlack({
      text,
      iconEmoji,
      slackbotName,
      webhookUrl,
    })
  }

  if (includes('discord')(process.env.CHANGELOG_WEBHOOK_URL)) {
    return postToDiscord({
      text,
      iconEmoji,
      slackbotName,
      webhookUrl,
    })
  }
}

module.exports = run
