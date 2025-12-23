import test from 'ava'
import supertest from 'supertest'
import app from '../../../src/app'
import { encryptData } from '../../../src/services/crypto'

const server = app.listen()
const request = supertest.agent(server)

// Use an existing problem from seeds (pid: 1000)
const testPid = 1000

test.before('Login as regular user', async (t) => {
  const login = await request
    .post('/api/account/login')
    .send({
      username: 'primaryuser',
      password: await encryptData('testtest'),
    })

  t.is(login.status, 200)
})

test('Find testcases - should be denied for non-admin/non-owner', async (t) => {
  const res = await request
    .get(`/api/problem/${testPid}/testcases`)

  t.is(res.status, 403)
})

test('Create testcase - should be denied for non-admin/non-owner', async (t) => {
  const res = await request
    .post(`/api/problem/${testPid}/testcases`)
    .send({
      in: '1 2\n',
      out: '3\n',
    })

  t.is(res.status, 403)
})

test('Export testcases - should be denied for non-admin/non-owner', async (t) => {
  const res = await request
    .get(`/api/problem/${testPid}/testcases/export`)

  t.is(res.status, 403)
})

test('Get testcase - should be denied for non-admin/non-owner', async (t) => {
  const dummyUuid = '00000000-0000-0000-0000-000000000000'
  const res = await request
    .get(`/api/problem/${testPid}/testcases/${dummyUuid}.in`)

  t.is(res.status, 403)
})

test('Remove testcase - should be denied for non-admin/non-owner', async (t) => {
  const dummyUuid = '00000000-0000-0000-0000-000000000000'
  const res = await request
    .delete(`/api/problem/${testPid}/testcases/${dummyUuid}`)

  t.is(res.status, 403)
})

test.after.always('close server', () => {
  server.close()
})
