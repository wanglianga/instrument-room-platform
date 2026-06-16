import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { Performance } from '@/types'

export interface PerformanceQueryParams {
  page?: number
  pageSize?: number
  name?: string
  status?: string
  date?: string
}

export const getPerformanceList = (
  params: PerformanceQueryParams
): Promise<ApiResponse<Performance[]>> => {
  return request.get('/performances', { params })
}

export const getPerformanceDetail = (id: number): Promise<ApiResponse<Performance>> => {
  return request.get(`/performances/${id}`)
}

export const createPerformance = (
  data: Partial<Performance>
): Promise<ApiResponse<Performance>> => {
  return request.post('/performances', data)
}

export const updatePerformance = (
  id: number,
  data: Partial<Performance>
): Promise<ApiResponse<Performance>> => {
  return request.put(`/performances/${id}`, data)
}

export const deletePerformance = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/performances/${id}`)
}

export const allocateInstrument = (
  performanceId: number,
  instrumentId: number,
  quantity: number
): Promise<ApiResponse<void>> => {
  return request.post(`/performances/${performanceId}/instruments`, {
    instrumentId,
    quantity,
  })
}

export const returnInstrument = (
  performanceId: number,
  allocationId: number
): Promise<ApiResponse<void>> => {
  return request.post(
    `/performances/${performanceId}/instruments/${allocationId}/return`
  )
}
