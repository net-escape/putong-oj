import type { Solution } from '@/types'
import { defineStore } from 'pinia'
import api from '@/api'
import { encryptData } from '@/utils/crypto'

export const useSolutionStore = defineStore('solution', {
  state: () => ({
    solution: {
      language: null,
      code: '',
    } as Solution,
  }),
  actions: {
    async findOne (payload: { [key: string]: any }) {
      const { data } = await api.solution.findOne(payload)
      this.solution = data.solution
    },
    async updateSolution (payload: { judge: number }) {
      const solutionId = (this.solution as any).sid!
      const { data } = await api.solution.updateSolution(solutionId, payload)
      if (data.success && data.data) {
        this.solution = data.data
      }
      return data
    },
    async create (payload: { code: string, [key: string]: any }) {
      return api.solution.create({ ...payload, code: await encryptData(payload.code) })
    },
    clearSavedSolution () {
      this.solution = { language: null, code: '' }
    },
    clearCode () {
      this.solution.code = ''
    },
  },
})
