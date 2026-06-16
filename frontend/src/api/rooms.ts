import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { Room } from '@/types'

export interface RoomQueryParams {
  page?: number
  pageSize?: number
  name?: string
  type?: string
  status?: string
}

export const getRoomList = (params: RoomQueryParams): Promise<ApiResponse<Room[]>> => {
  return request.get('/rooms', { params })
}

export const getRoomDetail = (id: number): Promise<ApiResponse<Room>> => {
  return request.get(`/rooms/${id}`)
}

export const createRoom = (data: Partial<Room>): Promise<ApiResponse<Room>> => {
  return request.post('/rooms', data)
}

export const updateRoom = (id: number, data: Partial<Room>): Promise<ApiResponse<Room>> => {
  return request.put(`/rooms/${id}`, data)
}

export const deleteRoom = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/rooms/${id}`)
}
