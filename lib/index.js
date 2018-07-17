const request = require('request')
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

function postBitBucket (uri, repositoryUser, repositoryName, options = {}) {
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

function create (repositoryUser, repositoryName, title, description, sourceBranch, destinationBranch, closeSourceBranch = true) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests`,
    repositoryUser,
    repositoryName,
    {
      title,
      description,
      source: {
        branch: {
          name: sourceBranch
        },
        repository: {
          full_name: `${repositoryUser}/${repositoryName}`
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

function approve (repositoryUser, repositoryName, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests/${pullRequestId}/approve`,
    repositoryUser, repositoryName)
}

function decline (repositoryUser, repositoryName, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests/${pullRequestId}/decline`,
    repositoryUser, repositoryName)
}


function get (repositoryUser, repositoryName, prId = '', options = {}) {
  return httpRequest({
    method: 'GET',
    uri: `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests/${prId}`,
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

function getRepo (repositoryUser, repositoryName, options = {}) {
  return httpRequest({
    method: 'GET',
    uri: `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/default-reviewers`,
    json: true,
    header: {
      'Content-Type': 'applications/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
    }
  })
}

module.exports = {
  create,
  get,
  approve,
  decline,
  getRepo
}
