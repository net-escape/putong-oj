import type { RouteRecordRaw } from 'vue-router'

import Problem from '@/views/Problem/Problem.vue'
import ProblemInfo from '@/views/Problem/ProblemInfo.vue'
import ProblemSubmit from '@/views/Problem/ProblemSubmit.vue'
import Problems from '@/views/Problems.vue'

const ProblemCreate = () => import('@/views/Admin/ProblemCreate.vue')
const ProblemEdit = () => import('@/views/Problem/ProblemEdit.vue')
const ProblemStatistics = () => import('@/views/Problem/Statistics.vue')
const Testcase = () => import('@/views/Problem/Testcase.vue')

const problemRoutes: Array<RouteRecordRaw> = [
  {
    path: '/problems',
    name: 'problems',
    component: Problems,
    meta: { title: 'Problems' },
  },
  {
    path: '/problems/create',
    name: 'problemCreate',
    component: ProblemCreate,
    meta: { title: 'Create Problem', requiresLogin: true },
  },
  {
    path: '/problem/:pid',
    component: Problem,
    children: [
      {
        path: '',
        name: 'problemInfo',
        component: ProblemInfo,
        meta: { title: 'Problem Info' },
      },
      {
        path: 'submit',
        name: 'problemSubmit',
        component: ProblemSubmit,
        meta: { title: 'Problem Info' },
      },
      {
        path: 'mySubmission',
        redirect: { name: 'MySubmissions' },
      },
      {
        path: 'statistics',
        name: 'problemStatistics',
        component: ProblemStatistics,
        meta: { title: 'Problem Info' },
      },
      {
        path: 'edit',
        name: 'problemEdit',
        component: ProblemEdit,
        meta: { title: 'Admin', requiresLogin: true },
      },
      {
        path: 'testcase',
        name: 'testcase',
        component: Testcase,
        meta: { title: 'Admin', requiresLogin: true },
      },
    ],
  },
]

export default problemRoutes
