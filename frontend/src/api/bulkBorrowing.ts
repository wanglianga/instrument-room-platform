import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { BulkBorrowing } from '@/types'

export interface BulkBorrowingQueryParams {
  page?: number
  pageSize?: number
  status?: string
}

export const getBulkBorrowingList = (params: BulkBorrowingQueryParams): Promise<ApiResponse<BulkBorrowing[]>> => {
  return request.get('/bulk-borrowings', { params })
}

export const getBulkBorrowingDetail = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.get(`/bulk-borrowings/${id}`)
}

export const createBulkBorrowing = (
  data: Partial<BulkBorrowing>
): Promise<ApiResponse<BulkBorrowing>> => {
  return request.post('/bulk-borrowings', data)
}

export const updateBulkBorrowing = (
  id: number,
  data: Partial<BulkBorrowing>
): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}`, data)
}

export const detectConflicts = (id: number): Promise<ApiResponse<any[]>> => {
  return request.get(`/bulk-borrowings/${id}/conflicts`)
}

export const submitForApproval = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/submit`)
}

export const approveBulkBorrowing = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/approve`)
}

export const rejectBulkBorrowing = (id: number, reason: string): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/reject`, { reason })
}

export const lockBulkBorrowing = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/lock`)
}

export const completeBulkBorrowing = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/complete`)
}

export const cancelBulkBorrowing = (id: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.patch(`/bulk-borrowings/${id}/cancel`)
}

export const addBulkBorrowingItems = (id: number, items: any[]): Promise<ApiResponse<BulkBorrowing>> => {
  return request.post(`/bulk-borrowings/${id}/items`, { items })
}

export const removeBulkBorrowingItem = (id: number, itemId: number): Promise<ApiResponse<BulkBorrowing>> => {
  return request.delete(`/bulk-borrowings/${id}/items/${itemId}`)
}

export const resolveConflict = (conflictId: number): Promise<ApiResponse<any>> => {
  return request.patch(`/bulk-borrowings/conflicts/${conflictId}/resolve`)
}

export const deleteBulkBorrowing = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/bulk-borrowings/${id}`)
}
