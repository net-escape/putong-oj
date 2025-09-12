const test = require('ava')
const supertest = require('supertest')
const app = require('../../../src/app')
const { encryptData } = require('../../../src/services/crypto')
const { userSeeds } = require('../../seeds/user')

const server = app.listen()
const request = supertest.agent(server)

const user = userSeeds.ugordon

test.before('Login', async (t) => {
  const login = await request
    .post('/api/session')
    .send({
      uid: user.uid,
      pwd: await encryptData(user.pwd),
    })

  t.is(login.status, 200)
})

// 1004: reserved
test('Normal user can not visit reserved problem', async (t) => {
  const res = await request
    .get('/api/problem/1004')

  t.is(res.status, 403)
})

test('Query problem list', async (t) => {
  const res = await request
    .get('/api/problem')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.list.docs))
  t.is(res.body.list.docs.length, res.body.list.total)
  t.truthy(Array.isArray(res.body.solved))
})

test.after.always('close server', () => {
  server.close()
})
