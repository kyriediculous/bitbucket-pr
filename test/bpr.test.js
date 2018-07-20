const bpr = require('../lib/index')
const assert = require('assert')
describe('User', function () {
  let repo, prId, username, password, options
  beforeEach(() => {
    repo = 'nicovergauwen/bpr-test-repository',
    username = "..."
    password = "..."
    options = {
      user: username,
      password
    }
  })
  it('GET: user data', async function() {
    this.timeout(0)
    let user = await bpr.getUser(options)
    assert(user.username === "nicovergauwen")
  })
  it('GET: repository', async function() {
     this.timeout(0);
    let repository = await bpr.getRepo(repo, options)
    console.info(repository)
  })
  it('POST: Create pull request')
})
