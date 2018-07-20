# Bitbucket Pull Request

## Module

```javascript
const bpr = require('bitbucket-pr')
```

```javascript
import bpr from 'bitbucket-pr'
```

### Create

```javascript
 let result = await bpr.create(
   'mybitbucketusername/myrepository', // repository
    'My first PR', // title
    'This is my first pull request', // description
    'test_branch', // source branch
    'master', // destination branch
    {
      user: 'mybitbucketusername',
      password: 'mybitbucketpassword'
    }
  )
```

### Get

```javascript
 let result = await bpr.get(
   'mybitbucketusername/myrepository', // repository
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
    'mybitbucketusername/myrepository', // repository
    '1', // PR id
    {
      user: 'mybitbucketusername',
      password: 'mybitbucketpassword'
    }
  )
```

### Decline
```javascript
  result = await bpr.decline(
    'mybitbucketusername/myrepository', // repository
    '1', // PR id
    {
      user: 'mybitbucketusername',
      password: 'mybitbucketpassword'
    }
  )
```

### getRepo
```javascript
  result = await bpr.getRepo(
    'mybitbucketusername/myrepository', // repository
    {
      user: 'mybitbucketusername',
      password: 'mybitbucketpassword'
    }
  )
```

### getUser
```javascript
  result = await bpr.getUser(
    {
      user: 'mybitbucketusername',
      password: 'mybitbucketpassword'
    }
  )
  //Returns user details , team permissions and repository permissions 
```
