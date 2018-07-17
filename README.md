# Bitbucket Pull Request

## Module

```javascript
const bpr = require('bitbucket-pr')
```

```javascript
import {create, get, approve, decline} from 'bitbucket-pr'
```

### Create

```javascript
 let result = await bpr.create(
    'repositoryOwner', // repository user
    'repositoryName', // repository name
    'My first PR', // title
    'This is my first pull request', // description
    'test_branch', // source branch
    'master' // destination branch
  )
```

### Get

```javascript
 let result = await bpr.get(
   'mybitbucketusername', // repository user
   'myrepository', // repository name
   '1', //pullrequest ID , optional !
   {
     user: 'mybitbucketusername',
     password: 'mybitbucketpassword'
   }
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
