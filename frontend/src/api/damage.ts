import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { DamageRecord } from '@/types'

export interface DamageQueryParams {
  page?: number
  pageSize?: number
  instrumentId?: number
  userId?: number
  severity?: string
  compensationStatus?: string
}

export const getDamageList = (params: DamageQueryParams): Promise<ApiResponse<DamageRecord[]>> => {
  return request.get('/damages', { params })
}

export const getDamageDetail = (id: number): Promise<ApiResponse<DamageRecord>> => {
  return request.get(`/damages/${id}`)
}

export const createDamage = (
  data: Partial<DamageRecord>
): Promise<ApiResponse<DamageRecord>> => {
  return request.post('/damages', data)
}

export const updateDamage = (
  id: number,
  data: Partial<DamageRecord>
): Promise<ApiResponse<DamageRecord>> => {
  return request.put(`/damages/${id}`, data)
}

export const processCompensation = (
  id: number,
  status: 'paid' | 'waived',
  amount?: number
): Promise<ApiResponse<void>> => {
  return request.post(`/damages/${id}/compensation`, { status, amount })
}
