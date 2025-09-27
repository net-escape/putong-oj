import type { UserDocument } from '../../src/models/User'
import test from 'ava'
import authnMiddleware from '../../src/middlewares/authn'
import { passwordChecksum, passwordHash } from '../../src/utils'
import constants from '../../src/utils/constants'
import { ERR_LOGIN_REQUIRE, ERR_PERM_DENIED } from '../../src/utils/error'
import { userSeeds } from '../seeds/user'
import '../../src/config/db'

const { privilege } = constants

const nonExistUserId = 'MauthnNonExist'
const anyChecksum = passwordChecksum(passwordHash('Mauthn4nyPwd'))
const testUsers: Record<string, Partial<UserDocument>> = {
  banned: Object.assign({}, userSeeds.MauthnBanned, {
    checksum: passwordChecksum(passwordHash(userSeeds.MauthnBanned.pwd!)),
  }),
  normal: Object.assign({}, userSeeds.MauthnNormal, {
    checksum: passwordChecksum(passwordHash(userSeeds.MauthnNormal.pwd!)),
  }),
  admin: Object.assign({}, userSeeds.MauthnAdmin, {
    checksum: passwordChecksum(passwordHash(userSeeds.MauthnAdmin.pwd!)),
  }),
  root: Object.assign({}, userSeeds.MauthnRoot, {
    checksum: passwordChecksum(passwordHash(userSeeds.MauthnRoot.pwd!)),
  }),
}

const parseError = (code: number, message: string): string => {
  return `Error ${code}: ${message}`
}

const throwError = (code: number, message: string) => {
  throw new Error(parseError(code, message))
}

test('checkSession (no session)', async (t) => {
  const ctx = { state: {}, session: {} } as any

  const result = await authnMiddleware.checkSession(ctx)
  t.is(result, undefined)
  t.is(ctx.state.profile, undefined)
})

test('checkSession (already checked)', async (t) => {
  const ctx = {
    state: {
      authnChecked: true,
      profile: {
        uid: nonExistUserId,
        checksum: anyChecksum,
        privilege: privilege.User,
      },
    },
  } as any

  const result = await authnMiddleware.checkSession(ctx)
  t.is(result, ctx.state.profile)
  t.is(ctx.state.authnChecked, true)
  t.is(ctx.state.profile?.uid, nonExistUserId)
})

test('checkSession (non-existent user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: {
        uid: nonExistUserId,
        checksum: anyChecksum,
        privilege: privilege.User,
      },
    },
  } as any
  const result = await authnMiddleware.checkSession(ctx)

  t.is(result, undefined)
  t.is(ctx.state.profile, undefined)
  t.is(ctx.session.profile, undefined)
})

test('checkSession (password changed)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: {
        ...testUsers.normal,
        checksum: anyChecksum,
      },
    },
  } as any
  const result = await authnMiddleware.checkSession(ctx)

  t.is(result, undefined)
  t.is(ctx.state.profile, undefined)
  t.is(ctx.session.profile, undefined)
})

test('checkSession (privilege changed)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: {
        ...testUsers.normal,
        privilege: privilege.Admin,
      },
    },
  } as any
  const result = await authnMiddleware.checkSession(ctx)

  t.truthy(result)
  t.is(result?.privilege, privilege.User)
  t.is(ctx.state.profile?.privilege, privilege.User)
})

test('checkSession (banned user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.banned,
    },
  } as any
  const result = await authnMiddleware.checkSession(ctx)

  t.is(result, undefined)
  t.is(ctx.state.profile, undefined)
  t.is(ctx.session.profile, undefined)
})

test('checkSession (normal user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.normal,
    },
  } as any
  const result = await authnMiddleware.checkSession(ctx)

  t.truthy(result)
  t.is(result?.uid, testUsers.normal.uid)
  t.is(ctx.state.profile?.uid, testUsers.normal.uid)
})

test('loginRequire (no session)', async (t) => {
  const ctx = { state: {}, session: {}, throw: throwError } as any

  await t.throwsAsync(
    authnMiddleware.loginRequire(ctx, async () => { }),
    { message: parseError(...ERR_LOGIN_REQUIRE) },
  )
})

test('loginRequire (banned user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.banned,
    },
    throw: throwError,
  } as any

  await t.throwsAsync(
    authnMiddleware.loginRequire(ctx, async () => { }),
    { message: parseError(...ERR_LOGIN_REQUIRE) },
  )
})

test('loginRequire (valid user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.normal,
    },
  } as any

  let nextCalled = false
  await authnMiddleware.loginRequire(ctx, async () => { nextCalled = true })
  t.true(nextCalled)
})

test('adminRequire (no session)', async (t) => {
  const ctx = { state: {}, session: {}, throw: throwError } as any

  await t.throwsAsync(
    async () => authnMiddleware.adminRequire(ctx, async () => { }),
    { message: parseError(...ERR_LOGIN_REQUIRE) },
  )
})

test('adminRequire (normal user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.normal,
    },
    throw: throwError,
  } as any

  await t.throwsAsync(
    async () => authnMiddleware.adminRequire(ctx, async () => { }),
    { message: parseError(...ERR_PERM_DENIED) },
  )
})

test('adminRequire (admin user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.admin,
    },
  } as any

  let nextCalled = false
  await authnMiddleware.adminRequire(ctx, async () => { nextCalled = true })
  t.true(nextCalled)
})

test('adminRequire (root user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.root,
    },
  } as any

  let nextCalled = false
  await authnMiddleware.adminRequire(ctx, async () => { nextCalled = true })
  t.true(nextCalled)
})

test('rootRequire (no session)', async (t) => {
  const ctx = { state: {}, session: {}, throw: throwError } as any

  await t.throwsAsync(
    async () => authnMiddleware.rootRequire(ctx, async () => { }),
    { message: parseError(...ERR_LOGIN_REQUIRE) },
  )
})

test('rootRequire (normal user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.normal,
    },
    throw: throwError,
  } as any

  await t.throwsAsync(
    async () => authnMiddleware.rootRequire(ctx, async () => { }),
    { message: parseError(...ERR_PERM_DENIED) },
  )
})

test('rootRequire (admin user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.admin,
    },
    throw: throwError,
  } as any

  await t.throwsAsync(
    async () => authnMiddleware.rootRequire(ctx, async () => { }),
    { message: parseError(...ERR_PERM_DENIED) },
  )
})

test('rootRequire (root user)', async (t) => {
  const ctx = {
    state: {},
    session: {
      profile: testUsers.root,
    },
  } as any

  let nextCalled = false
  await authnMiddleware.rootRequire(ctx, async () => { nextCalled = true })
  t.true(nextCalled)
})
