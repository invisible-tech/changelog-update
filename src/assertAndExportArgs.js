'use strict'

/* eslint no-console: 0 */

const path = require('path')
const {
  compact,
  flow,
  head,
  includes,
  split,
  toLower,
} = require('lodash/fp')

const pathConsumerPackage = path.join(process.cwd(), 'package.json')
const { 'release-note': releaseNote } = require(pathConsumerPackage)
const { EMOJI_LIST } = require('./constants')

const {
  'slackbot-name': slackbotName,
  'icon-emoji': iconEmoji,
} = releaseNote

const logWarningAndExit = arg => {
  console.log(`WARNING: ${arg} argument is missing.`)
  process.exit(1)
}
if (! slackbotName) logWarningAndExit('slackbot name')
if (! iconEmoji) logWarningAndExit('icon emoji')

const logAndExit = arg => {
  console.log(`WARNING: set ${arg} on your project package.json!`)
  process.exit(1)
}
if (slackbotName === '<your-slackbot-name>') logAndExit('<your-slackbot-name>')
if (iconEmoji === '<your-slackbot-emoji OR slack-emoji>') logAndExit('<your-slackbot-emoji OR slack-emoji>')

const iconEmojiLower = toLower(iconEmoji)
const splitAndReplaceColons = flow(
  split(':'),
  compact,
  head
)
const newIconEmoji = iconEmoji.includes(':') ? splitAndReplaceColons(iconEmojiLower) : iconEmojiLower

if (! includes(newIconEmoji)(EMOJI_LIST)) console.log('release-note: you are using a custom emoji')

const _iconEmoji = `:${newIconEmoji}:`

module.exports = {
  slackbotName,
  iconEmoji: _iconEmoji,
}
