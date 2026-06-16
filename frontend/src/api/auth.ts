import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { User } from '@/types'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const login = (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
  return request.post('/auth/login', params)
}

export const getCurrentUser = (): Promise<ApiResponse<User>> => {
  return request.get('/auth/me')
}

export const logout = (): Promise<ApiResponse<void>> => {
  return request.post('/auth/logout')
}

export const changePassword = (params: {
  oldPassword: string
  newPassword: string
}): Promise<ApiResponse<void>> => {
  return request.post('/auth/change-password', params)
}
