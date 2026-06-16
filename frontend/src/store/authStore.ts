import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const getRoleName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: '管理员',
    student: '学生',
    teacher: '指导老师',
    technician: '维修技师',
    performance_manager: '演出负责人',
  }
  return roleMap[role]
}
