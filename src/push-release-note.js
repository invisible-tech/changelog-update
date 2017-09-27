#!/usr/bin/env node

'use strict'

/* eslint no-console: 0 */

const execa = require('execa')
const got = require('got')
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
  console.log('WARNING: Required env var CHANGELOG_WEBHOOK_URL is missing. Skipping for now.')
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
  method: 'POST',
  body: payload,
}

got(CHANGELOG_WEBHOOK_URL, options)
  .then(res => {
    if (res.statusCode !== 200) {
      console.log(`OPTIONS: ${JSON.stringify(options, undefined, 2)}`)
      console.log(`PAYLOAD: ${payload}`)
      console.log(`STATUS: ${res.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(res.headers, undefined, 2)}`)
      process.exit(1)
    }
    return undefined
  })
  .catch(err => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
