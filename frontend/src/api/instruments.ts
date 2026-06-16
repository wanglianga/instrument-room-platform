import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { Instrument } from '@/types'

export interface InstrumentQueryParams {
  page?: number
  pageSize?: number
  name?: string
  category?: string
  status?: string
  isValuable?: boolean
}

export const getInstrumentList = (
  params: InstrumentQueryParams
): Promise<ApiResponse<Instrument[]>> => {
  return request.get('/instruments', { params })
}

export const getInstrumentDetail = (id: number): Promise<ApiResponse<Instrument>> => {
  return request.get(`/instruments/${id}`)
}

export const createInstrument = (
  data: Partial<Instrument>
): Promise<ApiResponse<Instrument>> => {
  return request.post('/instruments', data)
}

export const updateInstrument = (
  id: number,
  data: Partial<Instrument>
): Promise<ApiResponse<Instrument>> => {
  return request.put(`/instruments/${id}`, data)
}

export const deleteInstrument = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/instruments/${id}`)
}

export const updateInstrumentStatus = (
  id: number,
  status: string
): Promise<ApiResponse<Instrument>> => {
  return request.patch(`/instruments/${id}/status`, { status })
}
