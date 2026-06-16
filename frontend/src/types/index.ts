export type UserRole = 'admin' | 'student' | 'teacher' | 'technician' | 'performance_manager'

export interface User {
  id: number
  username: string
  name: string
  role: UserRole
  email: string
  phone?: string
  department?: string
  studentId?: string
  avatar?: string
  status: 'active' | 'inactive'
  depositPaid?: boolean
  maxBorrowDays?: number
  createdAt: string
}

export interface Instrument {
  id: number
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  purchasePrice: number
  status: 'available' | 'borrowed' | 'maintenance' | 'repair' | 'retired'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  location: string
  roomId?: number
  description?: string
  imageUrl?: string
  isValuable: boolean
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  createdAt: string
}

export interface Room {
  id: number
  name: string
  type: string
  capacity: number
  location: string
  status: 'available' | 'occupied' | 'maintenance'
  facilities: string[]
  description?: string
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  id: number
  dayOfWeek: number
  startTime: string
  endTime: string
  available: boolean
}

export interface Reservation {
  id: number
  userId: number
  userName: string
  instrumentId?: number
  instrumentName?: string
  roomId?: number
  roomName?: string
  type: 'instrument' | 'room' | 'both'
  purpose: string
  startTime: string
  endTime: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
  reviewBy?: number
  reviewByName?: string
  reviewAt?: string
  reviewComment?: string
  actualReturnTime?: string
  returnCondition?: string
  createdAt: string
}

export interface AuditItem {
  id: number
  type: 'qualification' | 'deposit' | 'borrow_duration' | 'valuable_instrument'
  userId: number
  userName: string
  userRole: string
  reservationId?: number
  instrumentId?: number
  instrumentName?: string
  status: 'pending' | 'approved' | 'rejected'
  currentValue?: string
  requestedValue?: string
  applicantNote?: string
  reviewerNote?: string
  reviewedBy?: number
  reviewedByName?: string
  reviewedAt?: string
  createdAt: string
}

export interface MaintenanceRecord {
  id: number
  instrumentId: number
  instrumentName: string
  type: 'routine' | 'tuning' | 'repair'
  planDate: string
  actualDate?: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  operator?: string
  description: string
  result?: string
  nextMaintenanceDate?: string
  createdAt: string
}

export interface RepairOrder {
  id: number
  instrumentId: number
  instrumentName: string
  reporterId: number
  reporterName: string
  technicianId?: number
  technicianName?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  diagnosis?: string
  solution?: string
  cost?: number
  reportedAt: string
  startedAt?: string
  completedAt?: string
}

export interface DamageRecord {
  id: number
  instrumentId: number
  instrumentName: string
  reservationId?: number
  userId?: number
  userName?: string
  description: string
  severity: 'minor' | 'moderate' | 'major' | 'severe'
  discoveredAt: string
  discoveredBy: string
  compensationRequired: boolean
  compensationAmount?: number
  compensationStatus: 'pending' | 'paid' | 'waived'
  createdAt: string
}

export interface Performance {
  id: number
  name: string
  date: string
  location: string
  organizer: string
  status: 'planning' | 'ongoing' | 'completed' | 'cancelled'
  description?: string
  instruments: PerformanceInstrument[]
  createdAt: string
}

export interface PerformanceInstrument {
  id: number
  performanceId: number
  instrumentId: number
  instrumentName: string
  quantity: number
  status: 'requested' | 'allocated' | 'returned'
  note?: string
}
