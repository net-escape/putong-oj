import type { contestLabelingStyle, contestRanklistVisibility } from '../utils/constants'

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
  ranklistVisibility: typeof contestRanklistVisibility[keyof typeof contestRanklistVisibility]
}

export interface SessionProfile {
  uid: string
  privilege: number
  checksum: string
  verifyContest?: number[]
}

export interface PaginateOption {
  page: number
  pageSize: number
}

export interface SortOption {
  sort: 1 | -1
  sortBy: string
}
