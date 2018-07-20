const request = require('request')
const _ = require('lodash')
const baseUrl = 'https://bitbucket.org/api/2.0'

async function httpRequest (options) {
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {
        return reject(err)
      }
      else if (response.statusCode >= 400 && response.statusCode <= 599) {
        let err = new Error(response.statusMessage)
        err.statusMessage = response.statusMessage
        err.statusCode = response.statusCode
        if (!options.returnBody) {
          err = _.merge(err, response)
        }
        return reject(err)
      }
      else {
        return resolve(body)
      }
    })
  })
}

function postBitBucket (uri, options = {}) {
  const user = options.user || process.env.BITBUCKET_PULLREQUEST_USER
  const pass = options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
  delete options.user
  delete options.password
  return httpRequest({
    method: 'POST',
    uri: uri,
    body: options,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user,
      pass
    }
  })
}

function create (repo, title, description, sourceBranch, destinationBranch, closeSourceBranch = true) {
  return postBitBucket(
    `${baseUrl}/repositories/${repo}/pullrequests`,
    {
      title,
      description,
      source: {
        branch: {
          name: sourceBranch
        },
        repository: {
          full_name: `${repo}`
        }
      },
      destination: {
        branch: {
          name: destinationBranch
        }
      },
      close_source_branch: closeSourceBranch
    })
}

function approve (repo, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repo}/pullrequests/${pullRequestId}/approve`)
}

function decline (repo, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repo}/pullrequests/${pullRequestId}/decline`)
}


function get (repo, prId = '', options = {}) {
  return httpRequest({
    method: 'GET',
    uri: `${baseUrl}/repositories/${repo}/pullrequests/${prId}`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
}

function getRepo (repo, options = {}) {
  return httpRequest({
    method: 'GET',
    uri: `${baseUrl}/repositories/${repo}/`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
}

async function getUser (options = {}) {
  let user = await httpRequest({
    method: 'GET',
    uri:  `${baseUrl}/user`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
  let userRepos = await httpRequest({
    method: 'GET',
    uri: `${baseUrl}/user/permissions/repositories`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
  let teams = await httpRequest({
    method: 'GET',
    uri: `${baseUrl}/user/permissions/teams`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
  return {
    username: user.username,
    display_name: user.display_name,
    account_id: user.account_id,
    account_uuid: user.uuid,
    avatar: user.links.avatar, //is a URI
    location: user.location,
    created: user.created_on,
    teams: teams.values.map(t => ({
      name: t.team.username,
      display_name: t.team.display_name,
      team_uuid: t.team.uuid,
      avatar: t.team.links.avatar, //is a URI
      permission: t.permission
    })),
    repositories: userRepos.values.map(r => ({
      name: r.repository.name,
      full_name: r.repository.full_name,
      uuid: r.repository.uuid,
      permission: r.permission
    }))
  }
}

module.exports {
  create,
  get,
  approve,
  decline,
  getRepo,
  getUser
}
