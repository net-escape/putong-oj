import type { contestLabelingStyle } from "../utils/constants"

export interface CourseRole {
  basic: boolean
  viewTestcase: boolean
  viewSolution: boolean
  manageProblem: boolean
  manageContest: boolean
  manageCourse: boolean
}

export interface ContestOption {
  labelingStyle: typeof contestLabelingStyle[keyof typeof contestLabelingStyle]
}

export interface SessionProfile {
  uid: string
  nick: string
  privilege: number
  pwd: string
  verifyContest?: number[]
}

export interface PaginateOption {
  page: number
  pageSize: number
}

export interface Paginated<T> {
  docs: T[]
  limit: number
  page: number
  pages: number
  total: number
}
