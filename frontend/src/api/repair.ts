import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { RepairOrder } from '@/types'

export interface RepairQueryParams {
  page?: number
  pageSize?: number
  instrumentId?: number
  technicianId?: number
  priority?: string
  status?: string
}

export const getRepairList = (params: RepairQueryParams): Promise<ApiResponse<RepairOrder[]>> => {
  return request.get('/repairs', { params })
}

export const getRepairDetail = (id: number): Promise<ApiResponse<RepairOrder>> => {
  return request.get(`/repairs/${id}`)
}

export const createRepair = (
  data: Partial<RepairOrder>
): Promise<ApiResponse<RepairOrder>> => {
  return request.post('/repairs', data)
}

export const updateRepair = (
  id: number,
  data: Partial<RepairOrder>
): Promise<ApiResponse<RepairOrder>> => {
  return request.put(`/repairs/${id}`, data)
}

export const assignRepair = (
  id: number,
  technicianId: number
): Promise<ApiResponse<void>> => {
  return request.post(`/repairs/${id}/assign`, { technicianId })
}

export const startRepair = (id: number): Promise<ApiResponse<void>> => {
  return request.post(`/repairs/${id}/start`)
}

export const completeRepair = (
  id: number,
  data: { solution: string; cost?: number }
): Promise<ApiResponse<void>> => {
  return request.post(`/repairs/${id}/complete`, data)
}
