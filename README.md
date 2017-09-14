<<<<<<< HEAD
# push-release-note
=======
# @invisible/release-note
>>>>>>> 8d73f04... refact: package name to @invisible/release-note

# Setup

1. Create a new project in Google App Engine (https://console.developers.google.com/projectcreate) and name it `push-release-note-staging`
2. Create a bucket called `envvars.push-release-note-staging.invisible.email` (https://console.cloud.google.com/storage/browser then select the project you just created)
3. Upload a `.env` file to that bucket
4. Repeat steps 1-3 above with a project called `push-release-note-production`

# Deployment

1. Make sure you have the `gcloud` SDK installed: https://cloud.google.com/sdk/

This function publishes the release note to Slack when the Pull Request get merged into master.

# Install

- Install the package as devDependency:  
```sh
yarn add -D @invisible/release-note
# or
npm install -D @invisible/release-note
```

2. If this is your first time running the `gcloud` cli, you will have to OAuth your account.

```bash
gcloud auth login
```

3. Now you can run the following to deploy

```bash
yarn run deploy-staging
yarn run deploy-production

# Or

npm run deploy-staging
npm run deploy-production

```
