const Buffer = require('node:buffer').Buffer
const path = require('node:path')
const fse = require('fs-extra')
const { pick } = require('lodash')
const config = require('../config')
const redis = require('../config/redis')
const Contest = require('../models/Contest')
const Problem = require('../models/Problem')
const Solution = require('../models/Solution')
const { only } = require('../utils')
const { purify, isAdmin } = require('../utils/helper')
const logger = require('../utils/logger')

// 返回提交列表
const find = async (ctx) => {
  const opt = ctx.request.query
  const page = Number.parseInt(opt.page) || 1
  const pageSize = Number.parseInt(opt.pageSize) || 30
  const filter = purify(only(opt, 'uid pid judge language mid'))
  const list = await Solution.paginate(filter, {
    sort: { sid: -1 },
    page,
    limit: pageSize,
    select: '-_id -code -error',
    lean: true,
    leanWithId: false,
    useEstimatedCount: Object.keys(filter).length === 0,
  })

  ctx.body = {
    list,
  }
}

// 返回一个提交
const findOne = async (ctx) => {
  const opt = Number.parseInt(ctx.params.sid)
  // 使用lean solution 就是一个 js 对象，没有 save 等方法
  const solution = await Solution.findOne({ sid: opt }).populate('course')

  if (solution == null) { ctx.throw(400, 'No such a solution') }
  if (!isAdmin(ctx.session.profile) && solution.uid !== ctx.session.profile.uid) { ctx.throw(403, 'Permission denied') }

  // 如果是 admin 请求，并且有 sim 值(有抄袭嫌隙)，那么也样将可能被抄袭的提交也返回
  let simSolution
  if (isAdmin(ctx.session.profile) && solution.sim) {
    simSolution = await Solution.findOne({ sid: solution.sim_s_id }).lean().exec()
  }

  ctx.body = {
    solution: {
      ...pick(solution, [ 'sid', 'pid', 'uid', 'mid', 'course', 'code', 'language',
        'create', 'status', 'judge', 'time', 'memory', 'error', 'sim', 'sim_s_id', 'testcases' ]),
      simSolution: simSolution
        ? pick(simSolution, [ 'sid', 'uid', 'code', 'create' ])
        : undefined,
    },
  }
}

/**
 * 创建一个提交
 */
const create = async (ctx) => {
  const profile = ctx.session.profile
  const opt = ctx.request.body
  const required = [ 'pid', 'code', 'language' ]
  for (const key of required) {
    if (!opt[key]) {
      ctx.throw(400, `Missing parameter: ${key}`)
    }
  }

  const uid = profile.uid
  const pid = Number.parseInt(opt.pid)
  const code = String(opt.code)
  const language = Number.parseInt(opt.language)
  const mid = Number.parseInt(opt.mid) || -1

  if (language < 0 || language > 5) {
    ctx.throw(400, 'Invalid language')
  }
  if (code.length < 8 || code.length > 16384) {
    ctx.throw(400, 'Code length should between 8 and 16384')
  }

  let course = null
  if (mid > 0) {
    const mid = Number.parseInt(opt.mid)
    const contest = await Contest.findOne({ cid: mid }).populate('course')
    if (!contest) {
      ctx.throw(400, 'No such a contest')
    }
    if (contest.end < Date.now()) {
      ctx.throw(400, 'Contest is ended!')
    }
    if (!contest.list.includes(pid)) {
      ctx.throw(400, 'No such a problem in the contest')
    }
    if (contest.course) {
      course = contest.course.id
    }
  }
  const problem = await Problem.findOne({ pid })
  if (!problem) {
    ctx.throw(400, 'No such a problem')
  }
  /**
   * @TODO
   */
  // if (problem.course && !course) {
  //   course = problem.course.id
  // }

  try {
    const timeLimit = problem.time
    const memoryLimit = problem.memory
    const type = problem.type
    const additionCode = problem.code

    let meta = { testcases: [] }
    const dir = path.resolve(__dirname, `../../data/${pid}`)
    const file = path.resolve(dir, 'meta.json')
    if (fse.existsSync(file)) {
      meta = await fse.readJson(file)
    }
    const testcases = meta.testcases.map((item) => {
      return {
        uuid: item.uuid,
        input: { src: `/app/data/${pid}/${item.uuid}.in` },
        output: { src: `/app/data/${pid}/${item.uuid}.out` },
      }
    })

    const solution = new Solution({
      pid, mid, uid, code, language, course,
      length: Buffer.from(code).length, // 这个属性是不是没啥用？
    })

    await solution.save()

    const sid = solution.sid
    const submission = {
      sid, timeLimit, memoryLimit,
      testcases, language, code,
      type, additionCode,
    }

    redis.rpush('judger:task', JSON.stringify(submission))
    logger.info(`Submission <${sid}> is created by user <${uid}>`)

    ctx.body = { sid }
  } catch (e) {
    ctx.throw(400, e.message)
  }
}

/**
 * 重测一个提交
 */
const update = async (ctx) => {
  const opt = ctx.request.body
  const { profile } = ctx.state
  if (opt.judge !== config.judge.RejudgePending) {
    ctx.throw(400, 'Invalid update')
  }

  const sid = Number.parseInt(ctx.params.sid)
  const solution = await Solution.findOne({ sid }).exec()
  if (!solution) {
    ctx.throw(400, 'No such a solution')
  }

  const pid = solution.pid
  const problem = await Problem.findOne({ pid }).lean().exec()
  if (!problem) {
    ctx.throw(400, 'No such a problem')
  }

  try {
    solution.judge = config.judge.RejudgePending
    solution.sim = 0
    solution.sim_s_id = 0
    await solution.save()

    const timeLimit = problem.time
    const memoryLimit = problem.memory
    const type = problem.type
    const additionCode = problem.code

    let meta = { testcases: [] }
    const dir = path.resolve(__dirname, `../../data/${pid}`)
    const file = path.resolve(dir, 'meta.json')
    if (fse.existsSync(file)) {
      meta = await fse.readJson(file)
    }
    const testcases = meta.testcases.map((item) => {
      return {
        uuid: item.uuid,
        input: { src: `/app/data/${pid}/${item.uuid}.in` },
        output: { src: `/app/data/${pid}/${item.uuid}.out` },
      }
    })
    const submission = {
      sid, timeLimit, memoryLimit, testcases,
      language: solution.language,
      code: solution.code,
      type, additionCode,
    }

    redis.rpush('judger:task', JSON.stringify(submission))
    logger.info(`Submission <${sid}> is called for rejudge by user <${profile.uid}>`)

    ctx.body = only(solution, 'sid judge')
  } catch (e) {
    ctx.throw(400, e.message)
  }
}

module.exports = {
  find,
  findOne,
  create,
  update,
}
