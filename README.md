# @invisible/changelog-update

[![CircleCI](https://circleci.com/gh/invisible-tech/changelog-update/tree/master.svg?style=svg)](https://circleci.com/gh/invisible-tech/changelog-update/tree/master)

Provides three helper methods to publish the latest additions to your changelog.

## `assert-changelog-update`

Asserts if there is an addition to your changelog in the current, unmerged branch.

## `push-changelog-update`

Pushes the changelog additions to Slack (more adapters will be added in the future).

## `last-changelog-update`

Logs the latest changelog additions to stdout. If you are on `master`, looks at the diff from two merges ago. If you are not on `master`, looks at the diff between `master` and `HEAD`

# Install

1. Install the package as devDependency:
```sh
yarn add -D @invisible/changelog-update
# or
npm install -D @invisible/changelog-update
```

2. If you wish to use `push-changelog-update`, set up a [Slack Webhook](https://my.slack.com/services/new/incoming-webhook/). NOTE: Slack will reject mutliple `POST`'s to the same webhook that have identical messages, so you might run into this while testing.

# Usage

## Programmatically

```javascript
  'use strict'

  const {
    assertChangelogUpdate,
    lastChangelogUpdate,
    pushChangelogUpdate,
  } = require('@invisible/changelog-update')


  // changelogFile defaults to CHANGELOG.md if no argument given
  // This method will throw if no addition has been made to your changelogFile since
  // the last merge commit
  assertChangelogUpdate({ changelogFile: 'CHANGELOG.txt' })

  const webhookUrl = process.env.CHANGELOG_WEBHOOK_URL

  // This method is async so it returns a promise that resolves the Response object from POST'ing to the Slack webhook
  pushChangelogUpdate({
    changelogFile: 'CHANGELOG.txt', // defaults to CHANGELOG.md
    iconEmoji: 'joy', // defaults to :robot_face:
    slackbotName: 'Cool Bot Name' , // defaults to Changelog
    webhookUrl,
  }).then(console.log).catch(console.error)

  const notes = lastChangelogUpdate()

  console.log(notes) // or do something cool with it
```

## Hook scripts

### `assert-changelog-update`
1. Append `assert-changelog-update` to `posttest` on `scripts` section of your `package.json`.
```json
  // It would look something like this:
  "scripts": {
    "posttest": "assert-changelog-update"
  }
```

You can also run it at any time from your CLI.
```
$ assert-changelog-update
```

### `push-changelog-update`
1. Add to the `deployment` section of your project `circle.yml` file the following:
`- push-changelog-update`

```yaml
# Your circle.yml should look like the below:
deployment:
  production:
    branch: master
    commands:
      - push-changelog-update
```

You can also run it at any time from your CLI.
```
$ push-changelog-update
```

2. Optional: set a name for your slack bot and an icon emoji in your `package.json`

```JSON
  "ChangelogUpdate": {
    "slackbotName": "Changelog Robot",
    "iconEmoji": "joy"
  }
```

3. If using Circle CI, add the `CHANGELOG_WEBHOOK_URL` variable to your project. This package will optionally load `dotenv` if it's present, so you may add this to your `.env` file as well.

## TODO
- Unit Tests
- Testing on multiple platforms
