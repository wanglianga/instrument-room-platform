import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { MaintenanceRecord } from '@/types'

export interface MaintenanceQueryParams {
  page?: number
  pageSize?: number
  instrumentId?: number
  type?: string
  status?: string
}

export const getMaintenanceList = (
  params: MaintenanceQueryParams
): Promise<ApiResponse<MaintenanceRecord[]>> => {
  return request.get('/maintenance', { params })
}

export const getMaintenanceDetail = (id: number): Promise<ApiResponse<MaintenanceRecord>> => {
  return request.get(`/maintenance/${id}`)
}

export const createMaintenance = (
  data: Partial<MaintenanceRecord>
): Promise<ApiResponse<MaintenanceRecord>> => {
  return request.post('/maintenance', data)
}

export const updateMaintenance = (
  id: number,
  data: Partial<MaintenanceRecord>
): Promise<ApiResponse<MaintenanceRecord>> => {
  return request.put(`/maintenance/${id}`, data)
}

export const completeMaintenance = (
  id: number,
  data: { result: string; nextMaintenanceDate?: string }
): Promise<ApiResponse<void>> => {
  return request.post(`/maintenance/${id}/complete`, data)
}
