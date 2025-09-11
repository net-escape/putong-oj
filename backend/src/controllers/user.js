const difference = require('lodash/difference')
const escapeRegExp = require('lodash/escapeRegExp')
const config = require('../config')
const Group = require('../models/Group')
const Solution = require('../models/Solution')
const User = require('../models/User')
const { only } = require('../utils')
const { generatePwd, isComplexPwd } = require('../utils/helper')
const { isAdmin, isRoot } = require('../utils/helper')
const logger = require('../utils/logger')

/**
 * 预加载用户信息
 */
const preload = async (ctx, next) => {
  const uid = ctx.params.uid
  const user = await User.findOne({ uid }).exec()
  if (!user) {
    ctx.throw(404, 'User not found!')
  }
  ctx.state.user = user
  return next()
}

/**
 * 查询用户列表
 */
const find = async (ctx) => {
  const profile = ctx.session.profile
  const opt = ctx.request.query
  const page = Number.parseInt(opt.page) || 1
  const pageSize = Number.parseInt(opt.pageSize) || 30
  const privilege = String(opt.privilege || '')
  const filterType = String(opt.type || 'nick')
  const filterContent = String(opt.content || '')

  const filter = {}
  if (privilege === 'admin' && isAdmin(profile)) {
    filter.privilege = { $in: [ config.privilege.Admin, config.privilege.Root ] }
  }
  if (filterType === 'uid' || filterType === 'name') {
    filter.$or = [
      { uid: { $regex: new RegExp(escapeRegExp(filterContent), 'i') } },
      { nick: { $regex: new RegExp(escapeRegExp(filterContent), 'i') } },
    ]
  }
  let result
  if (page !== -1) {
    result = await User.paginate(filter, {
      sort: { createdAt: -1 },
      page,
      limit: pageSize,
      lean: true,
      leanWithId: false,
      select: '-_id uid nick privilege createdAt',
    })
  } else {
    const docs = await User.find(filter, { uid: 1, nick: 1, _id: 0 }).lean().exec()
    result = {
      docs,
      total: docs.length,
    }
  }
  ctx.body = result
}

/**
 * 查询用户信息
 */
const findOne = async (ctx) => {
  const user = ctx.state.user
  const [ solved, failed, groups ] = await Promise.all([
    Solution
      .find({ uid: user.uid, judge: config.judge.Accepted })
      .distinct('pid')
      .lean()
      .exec(),
    Solution
      .find({ uid: user.uid, judge: { $ne: config.judge.Accepted } })
      .distinct('pid')
      .lean()
      .exec(),
    Group
      .find({ gid: { $in: user.gid } })
      .select('-_id gid title')
      .lean()
      .exec(),
  ])

  ctx.body = {
    user: {
      ...only(user, 'uid nick motto mail school privilege createdAt'),
      groups,
    },
    solved,
    unsolved: difference(failed, solved),
  }
}

/**
 * 创建用户
 */
const create = async (ctx) => {
  const opt = ctx.request.body
  const uid = String(opt.uid || '')
  const pwd = String(opt.pwd || '')
  const nick = String(opt.nick || '')

  if (!isComplexPwd(pwd)) {
    ctx.throw(400, 'The password is not complex enough!')
  }
  const exists = await User.findOne({
    uid: { $regex: new RegExp(`^${escapeRegExp(uid)}$`, 'i') },
  }).exec()
  if (exists) {
    ctx.throw(400, 'The username has been registered!')
  }
  const user = new User({
    uid, nick, pwd: generatePwd(pwd),
  })

  try {
    await user.save()
    const { requestId = 'unknown' } = ctx.state
    logger.info(`User <${user.uid}> is created [${requestId}]`)
  } catch (err) {
    ctx.throw(400, err.message)
  }
  ctx.body = {}
}

/**
 * 更新用户信息
 */
const update = async (ctx) => {
  const profile = ctx.session.profile
  const user = ctx.state.user

  if (!(
    profile.uid === user.uid || (
      user.privilege === config.privilege.Root
        ? isRoot(profile)
        : isAdmin(profile)
    ))
  ) {
    ctx.throw(403, 'You don\'t have permission to change this user\'s information!')
  }

  const opt = ctx.request.body
  const fields = [ 'nick', 'motto', 'school', 'mail' ]
  fields.forEach((field) => {
    if (typeof opt[field] === 'string') {
      user[field] = opt[field]
    }
  })

  const privilege = Number.parseInt(opt.privilege ?? user.privilege)
  if (privilege !== user.privilege && !(
    isRoot(profile)
    && profile.uid !== user.uid
  )) {
    ctx.throw(403, 'You don\'t have permission to change the privilege!')
  }
  user.privilege = privilege

  const oldPwd = String(opt.oldPwd || '')
  const newPwd = String(opt.newPwd || '')
  if (newPwd !== '') {
    if (user.pwd !== generatePwd(oldPwd) && !isAdmin(profile)) {
      ctx.throw(400, 'Old password is wrong!')
    }
    if (!isComplexPwd(newPwd)) {
      ctx.throw(400, 'The new password is not complex enough!')
    }
    user.pwd = generatePwd(newPwd)
  }

  try {
    await user.save()
    logger.info(`User <${user.uid}> is updated by user <${profile.uid}>`)
  } catch (e) {
    ctx.throw(400, e.message)
  }
  ctx.body = {}
}

module.exports = {
  preload,
  find,
  findOne,
  create,
  update,
}
