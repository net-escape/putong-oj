import type { PaginateOption } from '../types'
import crypto from 'node:crypto'

export function parsePaginateOption (
  opt: Record<string, unknown>,
  defaultPageSize = 10,
  maxPageSize = 100,
): PaginateOption {
  let page = Number(opt.page)
  let pageSize = Number(opt.pageSize)

  if (!Number.isInteger(page) || page <= 0) {
    page = 1
  }

  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    pageSize = defaultPageSize
  } else if (pageSize > maxPageSize) {
    pageSize = maxPageSize
  }

  return { page, pageSize }
}

export function generatePwd (pwd: string): string {
  return crypto.createHash('md5').update(pwd).digest('hex')
    + crypto.createHash('sha1').update(pwd).digest('hex')
}
