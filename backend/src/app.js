require('dotenv-flow').config()

const path = require('node:path')
const process = require('node:process')
const Koa = require('koa')
const { koaBody } = require('koa-body')
const koaLogger = require('koa-logger')
const send = require('koa-send')
const { createSession: session } = require('koa-session')
const staticServe = require('koa-static')
// In order to apply the moongoose plugin,
// DB must be inited before others.
require('./config/db')
const config = require('./config')
const setup = require('./config/setup')
const authnMiddleware = require('./middlewares/authn')
const router = require('./routes')
const logger = require('./utils/logger')

const app = new Koa()

// 日志，会在控制台显示请求的方法和路由
if (process.env.NODE_ENV === 'development') {
  app.use(koaLogger())
}

app.keys = [ config.secretKey ]

app.use(session({
  key: 'koa:oj:sess',
  maxAge: 7 * 24 * 60 * 60 * 60 * 1000, // ms
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
}, app))

app.use(koaBody({
  jsonLimit: '8mb', // 限制 JSON 数据大小
  formLimit: '8mb', // 限制表单数据大小
  textLimit: '8mb', // 限制文本数据大小
  multipart: true, // 支持文件上传
  formidable: {
    maxFileSize: 4 * 1024 * 1024, // 限制文件大小
  },
}))

app.use(staticServe(path.join(__dirname, '..', 'public'), {
  gzip: true,
  maxage: 7 * 24 * 60 * 60, // 7 天不更新，也就是缓存期限
}))

app.use(async (ctx, next) => {
  ctx.state.requestId = ctx.get('X-Request-ID') || 'unknown'
  await authnMiddleware.checkSession(ctx)
  await next()
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const { requestId = 'unknown' } = ctx.state
    ctx.status = err.status || 500
    ctx.body = { error: err.message }
    if (err.status) {
      logger.error(`HTTP/${err.status}: ${err.message} [${requestId}]`)
    } else {
      logger.error(`${err.message} [${requestId}]\n${err.stack}]`)
    }
  }
})

app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    return send(ctx, 'public/index.html')
  }
})

app.use(router.routes()).use(router.allowedMethods())

// do not start on 'test'
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, async () => {
    await setup()
    logger.info(`The server is running at http://localhost:${config.port}`)
  })
}

module.exports = app
