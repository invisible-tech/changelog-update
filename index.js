#!/usr/bin/env node

'use strict'

/* eslint no-console: 0 */

require('dotenv').config()
const https = require('https')
const { spawnSync } = require('child_process')
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

const { WEBHOOK_PATH } = process.env

if (! WEBHOOK_PATH) {
  console.log('WARNING: Required env var WEBHOOK_PATH is missing. Skipping for now.')
  process.exit()
}

const execSafe = fullCmd => {
  const [cmd, ...args] = split(' ', fullCmd)
  return spawnSync(cmd, args, { stdio: null, encoding: 'utf8' })
}

const exec = cmd => {
  const output = execSafe(cmd)
  const { status, stderr } = output
  if (status !== 0) {
    console.log(stderr)
    process.exit(status)
  }
  return output
}

const { stdout: log } = exec('git --no-pager log --merges -2 --minimal --unified=0')
const splitLines = split('\n')
const getLastMergeHash = flow(
  splitLines,
  filter(startsWith('commit')),
  last,
  split(' '),
  last
)
const lastMergeHash = getLastMergeHash(log)

const { stdout: diff } = exec(`git --no-pager diff ${lastMergeHash}..HEAD --minimal --unified=0 --no-color -- CHANGELOG.md`)
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
  username: 'Gear',
  text,
  icon_emoji: ':gear:',
})
const options = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(payload),
  },
  hostname: 'hooks.slack.com',
  method: 'POST',
  path: WEBHOOK_PATH,
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
