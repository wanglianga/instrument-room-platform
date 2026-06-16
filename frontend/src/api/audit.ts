import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { AuditItem } from '@/types'

export interface AuditQueryParams {
  page?: number
  pageSize?: number
  type?: string
  status?: string
  userId?: number
}

export const getAuditList = (params: AuditQueryParams): Promise<ApiResponse<AuditItem[]>> => {
  return request.get('/audits', { params })
}

export const getAuditDetail = (id: number): Promise<ApiResponse<AuditItem>> => {
  return request.get(`/audits/${id}`)
}

export const approveAudit = (
  id: number,
  note?: string
): Promise<ApiResponse<void>> => {
  return request.post(`/audits/${id}/approve`, { note })
}

export const rejectAudit = (
  id: number,
  note: string
): Promise<ApiResponse<void>> => {
  return request.post(`/audits/${id}/reject`, { note })
}
