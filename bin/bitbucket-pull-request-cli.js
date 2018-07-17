#!/usr/bin/env node
;(function () {

  process.title = 'bitbucket-pull-request'

  const bitbucketPullRequest = require('../lib/index.js')

  const nopt = require('nopt')

  const conf = nopt({
    username: [null, String],
    password: [null, String],
    repositoryName: String,
    repositoryUser: String,
    title: String,
    description: String,
    sourceBranch: String,
    destinationBranch: String
  }, {}, process.argv, 2)

  if (conf.argv.remain.length !== 1) {
    console.log('Wrong commands', conf.argv)
  }

  if (conf.argv.remain[0] === 'create') {
    bitbucketPullRequest.create(
      conf.repositoryUser,
      conf.repositoryName,
      conf.title,
      conf.description,
      conf.sourceBranch,
      conf.destinationBranch
    ).then((result) => {
      console.log(`\nPull Request: #${result.id} ${result.title} - ${result.links.html.href}`)
    })
      .catch(console.error)
  } else {
    console.log('Wrong commands', conf.argv)
  }

})()
