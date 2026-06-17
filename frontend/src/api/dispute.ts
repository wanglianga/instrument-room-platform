import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { ReturnDispute } from '@/types'

export interface DisputeQueryParams {
  page?: number
  pageSize?: number
  status?: string
  instrumentId?: number
}

export const getDisputeList = (params: DisputeQueryParams): Promise<ApiResponse<ReturnDispute[]>> => {
  return request.get('/disputes', { params })
}

export const getDisputeDetail = (id: number): Promise<ApiResponse<ReturnDispute>> => {
  return request.get(`/disputes/${id}`)
}

export const getDisputesByReservation = (reservationId: number): Promise<ApiResponse<ReturnDispute[]>> => {
  return request.get(`/disputes/reservation/${reservationId}`)
}

export const createDispute = (
  data: Partial<ReturnDispute>
): Promise<ApiResponse<ReturnDispute>> => {
  return request.post('/disputes', data)
}

export const teacherReviewDispute = (
  id: number,
  performanceImpact: string,
  comment: string
): Promise<ApiResponse<ReturnDispute>> => {
  return request.patch(`/disputes/${id}/teacher-review`, { performanceImpact, comment })
}

export const technicianQuoteDispute = (
  id: number,
  repairQuote: number,
  comment: string
): Promise<ApiResponse<ReturnDispute>> => {
  return request.patch(`/disputes/${id}/technician-quote`, { repairQuote, comment })
}

export const resolveDispute = (
  id: number,
  deductedAmount: number,
  resolutionNote: string
): Promise<ApiResponse<ReturnDispute>> => {
  return request.patch(`/disputes/${id}/resolve`, { deductedAmount, resolutionNote })
}

export const closeDispute = (id: number): Promise<ApiResponse<ReturnDispute>> => {
  return request.patch(`/disputes/${id}/close`)
}

export const deleteDispute = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/disputes/${id}`)
}
