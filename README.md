# @invisible/release-note

[![CircleCI](https://circleci.com/gh/invisible-tech/release-note/tree/master.svg?style=svg)](https://circleci.com/gh/invisible-tech/release-note/tree/master)

Provides two helper functions to publish release notes.

## assert-release-note

Asserts if there is a release note in the current Pull Request.

## push-release-note

Pushes the release note to Slack.

# Install

- Install the package as devDependency:  
```sh
yarn add -D @invisible/release-note
# or
npm install -D @invisible/release-note
```

# Usage

## assert-release-note
1. Append `assert-release-note` to `posttest` on `scripts` section of your `package.json`.
```json
  // It would look something like this:
  "scripts": {
    "posttest": "assert-release-note"
  }
```

## push-release-note
1. Add to the `deployment` section of your project `circle.yml` file the following:  
`- push-release-note`

```yaml
# Your circle.yml should look like the below:
deployment:
  production:
    branch: master
    commands:
      - push-release-note
```

2. Add to your project `package.json` the following:

```JSON
  "release-note": {
    "slackbot-name": "<your-slackbot-name>",
    "icon-emoji": "<your-slackbot-emoji OR slack-emoji>"
  }
```

3. Add `CHANGELOG_WEBHOOK_URL` environmental variable to your project on circleCI.
    
    If you already have a `CHANGELOG_WEBHOOK_URL`, you need to:

    - Go to `https://circleci.com/gh/invisible-tech/<your-project-name>/edit#env-vars` (replace \<your-project-name\>, e.g. gear)
    - Click on `Import Variable(s)`.
    - Select `CHANGELOG_WEBHOOK_URL`.
      - If you don't have permission to do that, ask your superior to do it!
    
    Otherwise:

    - Go to your [Slack Webhook Page](https://my.slack.com/services/new/incoming-webhook/).
    - Create or select the channel you want to add a webhook.
    - Click on `Add Incoming Webhooks Integration`
    - Copy the Webhook URL.
    - Go to `https://circleci.com/gh/invisible-tech/<your-project-name>/edit#env-vars` (replace \<your-project-name\>, e.g. gear)
    - Click on `Add Variable`.
    - Insert CHANGELOG\_WEBHOOK\_URL on `Name` field.
    - Paste the Webhook URL on `Value` field.
    - Click on `Add Variable`

* For more information, go to [Slack API Weebhook Page](https://api.slack.com/incoming-webhooks).
