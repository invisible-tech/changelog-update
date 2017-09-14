#!/usr/bin/env node

'use strict'

/* eslint no-console: 0 */

const https = require('https')
const execa = require('execa')
const {
  filter,
  flow,
  join,
  last,
  map,
  negate,
  overEvery,
  split,
  startsWith,
  trimCharsStart,
} = require('lodash/fp')

const {
  slackbotName,
  iconEmoji,
} = require('./assertAndExportArgs.js')

const { CHANGELOG_WEBHOOK_URL } = process.env

if (! CHANGELOG_WEBHOOK_URL) {
  console.log('WARNING: Required env var WEBHOOK_PATH is missing. Skipping for now.')
  process.exit(1)
}

const { stdout: log } = execa.sync('git', ['--no-pager', 'log', '--merges', '-2', '--minimal', '--unified=0'])
const splitLines = split('\n')
const getLastMergeHash = flow(
  splitLines,
  filter(startsWith('commit')),
  last,
  split(' '),
  last
)
const lastMergeHash = getLastMergeHash(log)

const { stdout: diff } = execa.sync('git', ['--no-pager', 'diff', `${lastMergeHash}..HEAD`, '--minimal', '--unified=0', '--no-color', '--', 'CHANGELOG.md'])
const getAdditions = flow(
  split('\n'),
  filter(overEvery([
    startsWith('+'),
    negate(startsWith('++')),
  ])),
  map(trimCharsStart('+')),
  join('\n')
)
const text = getAdditions(diff)

const payload = JSON.stringify({
  channel: '#inb-tng-changelog',
  username: slackbotName,
  text,
  icon_emoji: iconEmoji,
})
const options = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(payload),
  },
  hostname: 'hooks.slack.com',
  method: 'POST',
  path: CHANGELOG_WEBHOOK_URL,
}
const req = https.request(options, res => {
  if (res.statusCode !== 200) {
    console.log(`OPTIONS: ${JSON.stringify(options, undefined, 2)}`)
    console.log(`PAYLOAD: ${payload}`)
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers, undefined, 2)}`)
    process.exit(1)
  }
})
req.on('error', e => {
  console.error(`problem with request: ${e.message}`)
  process.exit(1)
})
req.write(payload)
req.end()
