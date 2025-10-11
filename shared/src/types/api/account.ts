import { z } from 'zod'
import { JudgeStatus, Language } from '@/consts/index.js'
import { stringToInt } from '../codec.js'
import { SolutionModelSchema } from '../model/solution.js'
import { UserModelSchema } from '../model/user.js'
import { PaginatedSchema, PaginationSchema, SortOptionSchema } from './utils.js'

export const AccountSessionSchema = z.object({
  uid: UserModelSchema.shape.uid,
  privilege: UserModelSchema.shape.privilege,
  checksum: z.base64(),
  verifyContest: z.array(z.number()).optional(),
})

export type AccountSession = z.infer<typeof AccountSessionSchema>

export const AccountProfileQueryResultSchema = z.object({
  uid: UserModelSchema.shape.uid,
  privilege: UserModelSchema.shape.privilege,
  nick: UserModelSchema.shape.nick,
  motto: UserModelSchema.shape.motto,
  mail: UserModelSchema.shape.mail,
  school: UserModelSchema.shape.school,
  verifyContest: AccountSessionSchema.shape.verifyContest,
})

export type AccountProfileQueryResult = z.input<typeof AccountProfileQueryResultSchema>

export const AccountLoginPayloadSchema = z.object({
  username: UserModelSchema.shape.uid,
  password: z.base64(),
})

export type AccountLoginPayload = z.infer<typeof AccountLoginPayloadSchema>

export const AccountRegisterPayloadSchema = z.object({
  username: UserModelSchema.shape.uid,
  password: z.base64(),
})

export type AccountRegisterPayload = z.infer<typeof AccountRegisterPayloadSchema>

export const AccountEditPayloadSchema = z.object({
  nick: UserModelSchema.shape.nick.optional(),
  motto: UserModelSchema.shape.motto.optional(),
  mail: UserModelSchema.shape.mail.optional(),
  school: UserModelSchema.shape.school.optional(),
})

export type AccountEditPayload = z.infer<typeof AccountEditPayloadSchema>

export const AccountChangePasswordPayloadSchema = z.object({
  oldPassword: z.base64(),
  newPassword: z.base64(),
})

export type AccountChangePasswordPayload = z.infer<typeof AccountChangePasswordPayloadSchema>

export const AccountSubmissionListQuerySchema = z.object({
  page: PaginationSchema.shape.page,
  pageSize: PaginationSchema.shape.pageSize.default(30),
  sort: SortOptionSchema.shape.sort,
  sortBy: z.enum(['createdAt', 'time', 'memory']).default('createdAt'),
  problem: stringToInt.pipe(z.int().nonnegative()).optional(),
  contest: stringToInt.pipe(z.union([z.int().nonnegative(), z.literal(-1)])).optional(),
  judge: stringToInt.pipe(z.enum(JudgeStatus)).optional(),
  language: stringToInt.pipe(z.enum(Language)).optional(),
})

export type AccountSubmissionListQuery = z.infer<typeof AccountSubmissionListQuerySchema>

export const AccountSubmissionListQueryResultSchema = PaginatedSchema(z.object({
  sid: SolutionModelSchema.shape.sid,
  pid: SolutionModelSchema.shape.pid,
  mid: SolutionModelSchema.shape.mid,
  language: SolutionModelSchema.shape.language,
  judge: SolutionModelSchema.shape.judge,
  time: SolutionModelSchema.shape.time,
  memory: SolutionModelSchema.shape.memory,
  createdAt: SolutionModelSchema.shape.createdAt,
}))

export type AccountSubmissionListQueryResult = z.input<typeof AccountSubmissionListQueryResultSchema>
