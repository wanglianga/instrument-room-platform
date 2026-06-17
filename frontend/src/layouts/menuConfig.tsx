import React from 'react'
import {
  DashboardOutlined,
  AppstoreOutlined,
  HomeOutlined,
  CalendarOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
  WarningOutlined,
  GroupOutlined,
} from '@ant-design/icons'
import type { UserRole } from '@/types'

interface MenuItemType {
  key: string
  icon?: React.ReactNode
  label: string
  roles?: string[]
  children?: MenuItemType[]
}

const allMenus: MenuItemType[] = [
  {
    key: '/dashboard',
    icon: React.createElement(DashboardOutlined),
    label: '仪表板',
  },
  {
    key: '/instruments',
    icon: React.createElement(AppstoreOutlined),
    label: '乐器档案管理',
  },
  {
    key: '/rooms',
    icon: React.createElement(HomeOutlined),
    label: '琴房管理',
  },
  {
    key: '/reservations',
    icon: React.createElement(CalendarOutlined),
    label: '预约借用',
  },
  {
    key: '/audit',
    icon: React.createElement(AuditOutlined),
    label: '审核管理',
    roles: ['admin', 'teacher'],
  },
  {
    key: '/return',
    icon: React.createElement(CheckCircleOutlined),
    label: '归还检查',
    roles: ['admin', 'technician'],
  },
  {
    key: '/dispute',
    icon: React.createElement(WarningOutlined),
    label: '归还验收分歧',
    roles: ['admin', 'teacher', 'technician', 'student'],
  },
  {
    key: '/maintenance',
    icon: React.createElement(ToolOutlined),
    label: '调音保养',
    roles: ['admin', 'technician'],
  },
  {
    key: '/repair',
    icon: React.createElement(ToolOutlined),
    label: '维修管理',
    roles: ['admin', 'technician'],
  },
  {
    key: '/compensation',
    icon: React.createElement(ExclamationCircleOutlined),
    label: '损坏赔偿',
    roles: ['admin'],
  },
  {
    key: '/performance',
    icon: React.createElement(TrophyOutlined),
    label: '演出调拨',
    roles: ['admin', 'performance_manager'],
  },
  {
    key: '/bulk-borrowing',
    icon: React.createElement(GroupOutlined),
    label: '大型活动批量借用',
    roles: ['admin', 'performance_manager', 'teacher'],
  },
  {
    key: '/users',
    icon: React.createElement(TeamOutlined),
    label: '用户管理',
    roles: ['admin'],
  },
]

export const getMenuItems = (role?: UserRole): any[] => {
  if (!role) return []

  return allMenus.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(role)
  })
}
