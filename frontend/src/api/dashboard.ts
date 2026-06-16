import request from '@/utils/request'
import type { ApiResponse } from '@/utils/request'

export interface DashboardStats {
  totalInstruments: number
  availableInstruments: number
  borrowedInstruments: number
  maintenanceInstruments: number
  totalRooms: number
  availableRooms: number
  todayReservations: number
  pendingAudits: number
  pendingRepairs: number
  monthlyReservations: { month: string; count: number }[]
  instrumentCategories: { category: string; count: number }[]
  recentActivities: { id: number; type: string; content: string; time: string }[]
}

export const getDashboardStats = (): Promise<ApiResponse<DashboardStats>> => {
  return request.get('/dashboard/stats')
}
