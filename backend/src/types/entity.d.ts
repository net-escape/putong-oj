import type { ObjectId } from 'mongoose'
import type { ContestOption, CourseRole } from '.'
import type { CourseDocument } from '../models/Course'
import type { encrypt, problemType, status } from '../utils/constants'

// Common

interface EntityTimestamps {
  createdAt: Date
  updatedAt: Date
}

interface Entity extends EntityTimestamps { }

// User

export interface UserEntity extends Entity {
  /** Unique user ID (Case-insensitive) */
  uid: string
  /** User password (hashed) */
  pwd: string
  privilege: number
  nick: string
  motto: string
  mail: string
  school: string
  gid: number[]
  submit: number
  solve: number
}

// Course

export interface CourseEntity extends Entity {
  courseId: number
  name: string
  description: string
  encrypt: typeof encrypt.Public | typeof encrypt.Private
}

export type CourseEntityEditable = Pick<CourseEntity,
  'name' | 'description' | 'encrypt'
>

export type CourseEntityItem = Pick<CourseEntity,
  'courseId' | 'name'
>

export type CourseEntityView = Pick<CourseEntity,
  'courseId' | 'name' | 'description' | 'encrypt'
>

export type CourseEntityPreview = CourseEntityView

export interface CourseEntityViewWithRole extends CourseEntityView {
  role: CourseRole
}

// Course Permission

export interface CoursePermEntity extends Entity {
  user: ObjectId
  course: ObjectId
  role: CourseRole
}

export interface CourseMemberEntity extends Omit<CoursePermEntity, 'course'> {
  user: Pick<UserEntity, 'uid' | 'nick' | 'privilege'>
}

// Problem

export interface ProblemEntity extends Entity {
  pid: number
  title: string
  /** Time limit in milliseconds */
  time: number
  /** Memory limit in kilobytes */
  memory: number
  description: string
  /** Input format description */
  input: string
  /** Output format description */
  output: string
  /** Input example */
  in: string
  /** Output example */
  out: string
  hint: string
  status: typeof status[keyof typeof status]
  /** Judge type */
  type: typeof problemType[keyof typeof problemType]
  /** Judger code */
  code: string
  tags: string[]
  course: CourseDocument | null
  submit: number
  solve: number
}

export type ProblemEntityEditable = Pick<ProblemEntity,
  'title' | 'time' | 'memory' | 'description' | 'input' | 'output' | 'in'
  | 'out' | 'hint' | 'status' | 'type' | 'code'
> & { course?: ObjectId | null }

export type ProblemEntityItem = Pick<ProblemEntity,
  'pid' | 'title'
>

export type ProblemEntityPreview = Pick<ProblemEntity,
  'pid' | 'title' | 'status' | 'type' | 'tags' | 'submit' | 'solve'
>

export type ProblemEntityView = Pick<ProblemEntity,
  'pid' | 'title' | 'time' | 'memory' | 'status' | 'tags' | 'description'
  | 'input' | 'output' | 'in' | 'out' | 'hint'
> & Partial<Pick<ProblemEntity, 'type' | 'code'>> & {
  course: CourseEntityViewWithRole | null
}

// Contest

export interface ContestEntity extends Entity {
  cid: number
  title: string
  start: number
  end: number
  list: number[]
  status: number
  encrypt: number
  argument: string
  option: ContestOption
  course: CourseDocument | null
}

export type ContestEntityEditable = Pick<ContestEntity,
  'title' | 'start' | 'end' | 'list' | 'status' | 'encrypt' | 'argument' | 'option'
> & { course?: ObjectId | null }

export type ContestEntityPreview = Pick<ContestEntity,
  'cid' | 'title' | 'start' | 'end' | 'status' | 'encrypt'
>

export type ContestEntityView = Pick<ContestEntity,
  'cid' | 'title' | 'start' | 'end' | 'status' | 'encrypt' | 'list' | 'option'
> & Partial<Pick<ContestEntity, 'argument'>> & {
  course: CourseEntityViewWithRole | null
}

// Contest Ranklist

export interface ContestRanklist {
  [uid: string]: {
    nick: string
    [pid: number]: {
      acceptedAt?: number
      failed: number
      pending: number
    }
  }
}

// Solution

export interface SolutionEntity extends Entity {
  sid: number
  pid: number
  uid: string
  mid: number
  course: CourseDocument | null
  code: string
  length: number
  language: number
  create: number
  status: number
  judge: number
  time: number
  memory: number
  error: string
  sim: number
  sim_s_id: number
  testcases: {
    uuid: string
    judge: number
    time: number
    memory: number
  }[]
}

// News

export interface NewsEntity extends Entity {
  nid: number
  title: string
  content: string
  status: number
  /** @deprecated Use `createdAt` instead */
  create: number
}

// Tag

export interface TagEntity extends Entity {
  tid: string
  list: number[]
  create: number
}

// Group

export interface GroupEntity extends Entity {
  gid: number
  title: string
  list: string[]
  create: number
}

// Discuss

export interface DiscussEntity extends Entity {
  did: number
  title: string
  uid: string
  comments: {
    uid: string
    content: string
    create: number
  }[]
  create: number
  update: number
}
