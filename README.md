# Bitbucket Pull Request

## Command line interface

### Create Pull Request

```bash
BITBUCKET_PULLREQUEST_USER=luislobo BITBUCKET_PULLREQUEST_PASSWORD=your_app_password \
bitbucket-pull-request-cli \
 create \
 --title "Pull Req Title"  \
 --description "Some test pull \nrequest description" \
 --repositoryUser "luislobo" \
 --repositoryName "bitbucket-pull-request-test" \
 --sourceBranch "test_branch" \
 --destinationBranch "master"
```

## Module

```javascript
const bpr = require('bitbucket-pull-request')
```

### Create

```javascript
 let result = await bpr.create(
    'luislobo', // repository user
    'bitbucket-pull-request-test', // repository name
    'some title', // title
    'some big description\ncomes here', // description
    'test_branch', // source branch
    'master' // destination branch
  )
```

### Get

```javascript
 let result = await bpr.create(
    'luislobo', // repository user
    'bitbucket-pull-request-test'
  )
```

### Approve
```javascript
  result = await bpr.approve(
    'luislobo',
    'bitbucket-pull-request-test',
    result.id
  )
```

### Decline
```javascript
  result = await bpr.decline(
    'luislobo',
    'bitbucket-pull-request-test',
    result.id
  )```
