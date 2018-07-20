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

/**
* @method create - Creates a new pull request
* @param {String} repo - full_name of the repository eg. "repo_owner/repo_name"
* @param {String} title - title / short description
* @param {String} description - description of the pull request
* @param {String} sourceBranch - Branch to submit under review
* @param {String} destinationBranch - The branch to merge with
* @param {Boolean} closeSourceBranch - (optional) close the source branch, default true
* @returns {String} - Response status , newly created PR if successful
*/
function create (repo, title, description, sourceBranch, destinationBranch, closeSourceBranch = true, options = {}) {
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

/**
* @method approve - Approve a pull request
* @param {String} repo - full_name of the repository
* @param pullRequestId - Id of the pull request
* @returns {String} - Response status
*/
function approve (repo, pullRequestId, options = {}) {
  return postBitBucket(
    `${baseUrl}/repositories/${repo}/pullrequests/${pullRequestId}/approve`, options)
}

/**
* @method approve - Decline a pull request
* @param {String} repo - full_name of the repository
* @param {String} pullRequestId - Id of the pull request
* @returns {String} - Response status
*/
function decline (repo, pullRequestId, options = {}) {
  return postBitBucket(
    `${baseUrl}/repositories/${repo}/pullrequests/${pullRequestId}/decline`, options)
}


/**
* @param {String} repo - full_name of the repository
* @param {String} prId - id of the pull request
* @param {Object} options - additional options
*/
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

module.exports = {
  create,
  get,
  approve,
  decline,
  getRepo,
  getUser
}
