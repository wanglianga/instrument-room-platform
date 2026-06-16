import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { User } from '@/types'

export interface UserQueryParams {
  page?: number
  pageSize?: number
  name?: string
  role?: string
  status?: string
  department?: string
}

export const getUserList = (params: UserQueryParams): Promise<ApiResponse<User[]>> => {
  return request.get('/users', { params })
}

export const getUserDetail = (id: number): Promise<ApiResponse<User>> => {
  return request.get(`/users/${id}`)
}

export const createUser = (data: Partial<User>): Promise<ApiResponse<User>> => {
  return request.post('/users', data)
}

export const updateUser = (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
  return request.put(`/users/${id}`, data)
}

export const deleteUser = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/users/${id}`)
}

export const updateUserStatus = (
  id: number,
  status: 'active' | 'inactive'
): Promise<ApiResponse<User>> => {
  return request.patch(`/users/${id}/status`, { status })
}
