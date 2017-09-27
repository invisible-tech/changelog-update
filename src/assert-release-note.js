#!/usr/bin/env node

'use strict'

/* eslint-disable no-console */

const execa = require('execa')
const { includes } = require('lodash/fp')
require('./assertAndExportArgs.js')

const { CIRCLE_BRANCH } = process.env
const ignoredBranches = ['master', 'production', 'staging']
const shouldIgnore = branch => includes(branch)(ignoredBranches)

if (! shouldIgnore(CIRCLE_BRANCH)) {
  const { stdout: testChangelog } = execa.sync('git', ['diff', '--name-only', 'origin/master...HEAD', '--', 'CHANGELOG.md'])
  if (! testChangelog) {
    console.log('This PR is missing a Release Note in CHANGELOG.md')
    process.exit(1)
  }
} else console.log(`This is ${CIRCLE_BRANCH}, skipping.`)
