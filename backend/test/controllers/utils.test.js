const fs = require('node:fs')
const { resolve } = require('node:path')
const test = require('ava')
const supertest = require('supertest')
const app = require('../../src/app')
const config = require('../../src/config')
const websiteConfig = require('../../src/config/website')

const server = app.listen()
const request = supertest.agent(server)

const filepath = resolve(__dirname, 'utils.test.js')
const content = fs.readFileSync(filepath, 'utf8')

test('Server time', async (t) => {
  const res = await request
    .get('/api/servertime')

  t.is(res.status, 200)
  t.is(res.type, 'application/json')
  t.truthy(res.body.serverTime)
  t.truthy(Number.isInteger(res.body.serverTime))
})

test('Website config', async (t) => {
  const res = await request
    .get('/api/website')

  t.is(res.status, 200)
  t.is(res.type, 'application/json')
  t.deepEqual(res.body.website, websiteConfig)
})

test('Visitor can not submit file', async (t) => {
  const res = await request
    .post('/api/upload')
    .attach('image', filepath)
  t.is(res.status, 401)
})

test('Admin could submit file', async (t) => {
  const res = await request
    .post('/api/session')
    .send({
      uid: 'admin',
      pwd: config.deploy.adminInitPwd,
    })
  t.is(res.status, 200)

  const submit = await request
    .post('/api/upload')
    .attach('image', filepath)

  t.is(submit.status, 200)

  const { url } = submit.body
  const uploaded = url.match(/\/uploads\/(.*)/)[1]

  const uploadedContent = fs.readFileSync(
    resolve(__dirname, '../../public/uploads', uploaded),
    'utf8',
  )
  t.is(uploadedContent, content)
})
