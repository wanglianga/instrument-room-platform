import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { Reservation } from '@/types'

export interface ReservationQueryParams {
  page?: number
  pageSize?: number
  userId?: number
  type?: string
  status?: string
  startTime?: string
  endTime?: string
}

export const getReservationList = (
  params: ReservationQueryParams
): Promise<ApiResponse<Reservation[]>> => {
  return request.get('/reservations', { params })
}

export const getReservationDetail = (id: number): Promise<ApiResponse<Reservation>> => {
  return request.get(`/reservations/${id}`)
}

export const createReservation = (
  data: Partial<Reservation>
): Promise<ApiResponse<Reservation>> => {
  return request.post('/reservations', data)
}

export const updateReservation = (
  id: number,
  data: Partial<Reservation>
): Promise<ApiResponse<Reservation>> => {
  return request.put(`/reservations/${id}`, data)
}

export const cancelReservation = (id: number): Promise<ApiResponse<void>> => {
  return request.post(`/reservations/${id}/cancel`)
}

export const approveReservation = (
  id: number,
  comment?: string
): Promise<ApiResponse<void>> => {
  return request.post(`/reservations/${id}/approve`, { comment })
}

export const rejectReservation = (
  id: number,
  comment: string
): Promise<ApiResponse<void>> => {
  return request.post(`/reservations/${id}/reject`, { comment })
}

export const returnReservation = (
  id: number,
  data: { condition: string; note?: string }
): Promise<ApiResponse<void>> => {
  return request.post(`/reservations/${id}/return`, data)
}
