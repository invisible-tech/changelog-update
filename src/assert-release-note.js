#!/usr/bin/env node

'use strict'

/* eslint-disable no-console */

const execa = require('execa')

require('./assertAndExportArgs.js')

const { CIRCLE_BRANCH } = process.env

if (CIRCLE_BRANCH === 'master') {
  console.log('This is master, skipping.')
  process.exit(0)
}

const { stdout: testChangelog } = execa.sync('git', ['diff', '--name-only', 'origin/master...HEAD', '--', 'CHANGELOG.md'])
if (! testChangelog) {
  console.log('This PR is missing a Release Note in CHANGELOG.md')
  process.exit(1)
}
