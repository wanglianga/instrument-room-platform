import type { User, Instrument, Room, Reservation, AuditItem, MaintenanceRecord, RepairOrder, DamageRecord, Performance, UserRole } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    email: 'admin@university.edu',
    phone: '13800138000',
    department: '教务处',
    status: 'active',
    depositPaid: true,
    maxBorrowDays: 30,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'student1',
    name: '张小明',
    role: 'student',
    email: 'zhangxm@university.edu',
    phone: '13800138001',
    department: '音乐学院',
    studentId: '202301001',
    status: 'active',
    depositPaid: true,
    maxBorrowDays: 14,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 3,
    username: 'teacher1',
    name: '李老师',
    role: 'teacher',
    email: 'lilaoshi@university.edu',
    phone: '13800138002',
    department: '音乐学院',
    status: 'active',
    depositPaid: true,
    maxBorrowDays: 60,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 4,
    username: 'tech1',
    name: '王技师',
    role: 'technician',
    email: 'wangjs@university.edu',
    phone: '13800138003',
    department: '后勤保障部',
    status: 'active',
    depositPaid: false,
    maxBorrowDays: 0,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 5,
    username: 'perf1',
    name: '赵演出',
    role: 'performance_manager',
    email: 'zhaoyc@university.edu',
    phone: '13800138004',
    department: '艺术中心',
    status: 'active',
    depositPaid: true,
    maxBorrowDays: 30,
    createdAt: '2024-02-15T00:00:00Z',
  },
]

export const mockInstruments: Instrument[] = [
  {
    id: 1,
    name: '雅马哈三角钢琴',
    category: '键盘乐器',
    brand: 'Yamaha',
    model: 'C7X',
    serialNumber: 'YAM-2023-0001',
    purchaseDate: '2023-06-15',
    purchasePrice: 128000,
    status: 'available',
    condition: 'excellent',
    location: '琴房A-101',
    roomId: 1,
    description: '专业级三角钢琴，适用于音乐会演出',
    isValuable: true,
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-06-01',
    createdAt: '2023-07-01T00:00:00Z',
  },
  {
    id: 2,
    name: '斯特拉迪瓦里小提琴',
    category: '弦乐器',
    brand: 'Stradivari',
    model: '1716',
    serialNumber: 'STR-2022-0001',
    purchaseDate: '2022-09-20',
    purchasePrice: 258000,
    status: 'borrowed',
    condition: 'good',
    location: '借出中',
    description: '高档小提琴，专业演奏用',
    isValuable: true,
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-05-15',
    createdAt: '2022-10-01T00:00:00Z',
  },
  {
    id: 3,
    name: '练习用吉他',
    category: '弹拨乐器',
    brand: 'Cort',
    model: 'AD810',
    serialNumber: 'CRT-2023-0015',
    purchaseDate: '2023-03-10',
    purchasePrice: 899,
    status: 'available',
    condition: 'good',
    location: '乐器室B-201',
    description: '入门级民谣吉他，适合练习使用',
    isValuable: false,
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-07-20',
    createdAt: '2023-04-01T00:00:00Z',
  },
  {
    id: 4,
    name: '架子鼓套装',
    category: '打击乐器',
    brand: 'Pearl',
    model: 'Export EXX',
    serialNumber: 'PRL-2023-0008',
    purchaseDate: '2023-05-05',
    purchasePrice: 8500,
    status: 'maintenance',
    condition: 'fair',
    location: '鼓房C-105',
    roomId: 5,
    description: '专业级架子鼓，五鼓三镲配置',
    isValuable: false,
    lastMaintenanceDate: '2024-03-10',
    nextMaintenanceDate: '2024-03-25',
    createdAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 5,
    name: '长笛',
    category: '木管乐器',
    brand: 'Yamaha',
    model: 'YFL-222',
    serialNumber: 'YAM-2023-0023',
    purchaseDate: '2023-04-18',
    purchasePrice: 2800,
    status: 'available',
    condition: 'excellent',
    location: '乐器室B-202',
    description: '标准C调长笛，适合学生练习',
    isValuable: false,
    lastMaintenanceDate: '2024-02-28',
    nextMaintenanceDate: '2024-08-28',
    createdAt: '2023-05-01T00:00:00Z',
  },
]

export const mockRooms: Room[] = [
  {
    id: 1,
    name: 'A-101 钢琴房',
    type: '钢琴房',
    capacity: 2,
    location: 'A栋1楼',
    status: 'available',
    facilities: ['三角钢琴', '空调', '谱架', '座椅'],
    description: '专业钢琴练习室',
    timeSlots: [
      { id: 1, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', available: true },
      { id: 2, dayOfWeek: 1, startTime: '14:00', endTime: '18:00', available: true },
      { id: 3, dayOfWeek: 1, startTime: '19:00', endTime: '22:00', available: true },
    ],
  },
  {
    id: 2,
    name: 'A-102 钢琴房',
    type: '钢琴房',
    capacity: 2,
    location: 'A栋1楼',
    status: 'available',
    facilities: ['立式钢琴', '空调', '谱架', '座椅'],
    description: '标准钢琴练习室',
    timeSlots: [],
  },
  {
    id: 3,
    name: 'B-201 综合练习室',
    type: '综合练习室',
    capacity: 10,
    location: 'B栋2楼',
    status: 'available',
    facilities: ['音响设备', '麦克风', '空调', '镜子'],
    description: '适合小型乐队排练',
    timeSlots: [],
  },
  {
    id: 4,
    name: 'B-202 声乐教室',
    type: '声乐教室',
    capacity: 15,
    location: 'B栋2楼',
    status: 'maintenance',
    facilities: ['钢琴', '音响', '麦克风', '空调'],
    description: '声乐教学专用教室',
    timeSlots: [],
  },
  {
    id: 5,
    name: 'C-105 鼓房',
    type: '打击乐教室',
    capacity: 4,
    location: 'C栋1楼',
    status: 'maintenance',
    facilities: ['架子鼓', '隔音棉', '空调'],
    description: '专业打击乐练习室',
    timeSlots: [],
  },
]

export const mockReservations: Reservation[] = [
  {
    id: 1,
    userId: 2,
    userName: '张小明',
    instrumentId: 2,
    instrumentName: '斯特拉迪瓦里小提琴',
    type: 'instrument',
    purpose: '参加校级音乐比赛排练',
    startTime: '2024-03-20T09:00:00Z',
    endTime: '2024-04-05T18:00:00Z',
    status: 'approved',
    reviewBy: 3,
    reviewByName: '李老师',
    reviewAt: '2024-03-18T10:00:00Z',
    reviewComment: '贵重乐器，请妥善保管',
    createdAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 2,
    userId: 2,
    userName: '张小明',
    roomId: 1,
    roomName: 'A-101 钢琴房',
    type: 'room',
    purpose: '钢琴练习',
    startTime: '2024-03-25T14:00:00Z',
    endTime: '2024-03-25T16:00:00Z',
    status: 'pending',
    createdAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 3,
    userId: 5,
    userName: '赵演出',
    instrumentId: 1,
    instrumentName: '雅马哈三角钢琴',
    type: 'instrument',
    purpose: '毕业音乐会演出',
    startTime: '2024-04-10T08:00:00Z',
    endTime: '2024-04-12T22:00:00Z',
    status: 'pending',
    createdAt: '2024-03-22T11:00:00Z',
  },
  {
    id: 4,
    userId: 3,
    userName: '李老师',
    roomId: 3,
    roomName: 'B-201 综合练习室',
    type: 'room',
    purpose: '乐队排练',
    startTime: '2024-03-28T18:00:00Z',
    endTime: '2024-03-28T21:00:00Z',
    status: 'completed',
    actualReturnTime: '2024-03-28T21:00:00Z',
    returnCondition: 'good',
    reviewBy: 1,
    reviewByName: '系统管理员',
    reviewAt: '2024-03-25T09:00:00Z',
    createdAt: '2024-03-20T16:00:00Z',
  },
]

export const mockAudits: AuditItem[] = [
  {
    id: 1,
    type: 'valuable_instrument',
    userId: 2,
    userName: '张小明',
    userRole: 'student',
    reservationId: 1,
    instrumentId: 2,
    instrumentName: '斯特拉迪瓦里小提琴',
    status: 'pending',
    applicantNote: '参加校级音乐比赛，需要使用专业乐器',
    createdAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 2,
    type: 'qualification',
    userId: 6,
    userName: '王小红',
    userRole: 'student',
    status: 'pending',
    requestedValue: '高级',
    applicantNote: '已通过钢琴八级考试，申请高级借用资格',
    createdAt: '2024-03-21T10:00:00Z',
  },
  {
    id: 3,
    type: 'deposit',
    userId: 7,
    userName: '刘小强',
    userRole: 'student',
    status: 'approved',
    currentValue: '未缴纳',
    requestedValue: '已缴纳(500元)',
    reviewedBy: 1,
    reviewedByName: '系统管理员',
    reviewedAt: '2024-03-19T14:00:00Z',
    reviewerNote: '押金已收到，资格已更新',
    createdAt: '2024-03-18T09:00:00Z',
  },
]

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 1,
    instrumentId: 1,
    instrumentName: '雅马哈三角钢琴',
    type: 'tuning',
    planDate: '2024-06-01',
    status: 'planned',
    description: '季度调音保养',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 2,
    instrumentId: 4,
    instrumentName: '架子鼓套装',
    type: 'routine',
    planDate: '2024-03-20',
    actualDate: '2024-03-20',
    status: 'in_progress',
    operator: '王技师',
    description: '鼓皮更换与调试',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 3,
    instrumentId: 5,
    instrumentName: '长笛',
    type: 'routine',
    planDate: '2024-02-28',
    actualDate: '2024-02-28',
    status: 'completed',
    operator: '王技师',
    description: '日常清洁保养',
    result: '保养完成，状态良好',
    nextMaintenanceDate: '2024-08-28',
    createdAt: '2024-02-20T00:00:00Z',
  },
]

export const mockRepairOrders: RepairOrder[] = [
  {
    id: 1,
    instrumentId: 4,
    instrumentName: '架子鼓套装',
    reporterId: 3,
    reporterName: '李老师',
    technicianId: 4,
    technicianName: '王技师',
    priority: 'medium',
    status: 'in_progress',
    description: '底鼓鼓皮破损，需要更换',
    diagnosis: '鼓皮自然磨损，需要更换新鼓皮',
    reportedAt: '2024-03-18T09:00:00Z',
    startedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 2,
    instrumentId: 3,
    instrumentName: '练习用吉他',
    reporterId: 2,
    reporterName: '张小明',
    priority: 'low',
    status: 'pending',
    description: '三弦打品，需要调整',
    reportedAt: '2024-03-22T14:00:00Z',
  },
  {
    id: 3,
    instrumentId: 5,
    instrumentName: '长笛',
    reporterId: 4,
    reporterName: '王技师',
    technicianId: 4,
    technicianName: '王技师',
    priority: 'low',
    status: 'completed',
    description: '按键弹簧老化',
    diagnosis: '弹簧老化，弹性不足',
    solution: '更换全部按键弹簧',
    cost: 200,
    reportedAt: '2024-02-25T10:00:00Z',
    startedAt: '2024-02-26T09:00:00Z',
    completedAt: '2024-02-28T16:00:00Z',
  },
]

export const mockDamageRecords: DamageRecord[] = [
  {
    id: 1,
    instrumentId: 3,
    instrumentName: '练习用吉他',
    reservationId: 5,
    userId: 8,
    userName: '陈同学',
    description: '琴头有轻微磕碰痕迹',
    severity: 'minor',
    discoveredAt: '2024-03-20T18:00:00Z',
    discoveredBy: '李老师',
    compensationRequired: false,
    compensationStatus: 'waived',
    createdAt: '2024-03-20T18:30:00Z',
  },
  {
    id: 2,
    instrumentId: 6,
    instrumentName: '大提琴',
    reservationId: 6,
    userId: 9,
    userName: '林同学',
    description: '琴码断裂，琴弦松弛',
    severity: 'moderate',
    discoveredAt: '2024-03-15T20:00:00Z',
    discoveredBy: '王技师',
    compensationRequired: true,
    compensationAmount: 800,
    compensationStatus: 'pending',
    createdAt: '2024-03-15T20:30:00Z',
  },
]

export const mockPerformances: Performance[] = [
  {
    id: 1,
    name: '2024年春季音乐会',
    date: '2024-05-15',
    location: '学校大礼堂',
    organizer: '音乐学院',
    status: 'planning',
    description: '年度春季音乐会，由各专业学生参演',
    instruments: [
      { id: 1, performanceId: 1, instrumentId: 1, instrumentName: '雅马哈三角钢琴', quantity: 1, status: 'requested' },
      { id: 2, performanceId: 1, instrumentId: 2, instrumentName: '斯特拉迪瓦里小提琴', quantity: 1, status: 'requested' },
    ],
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 2,
    name: '毕业生汇报演出',
    date: '2024-06-20',
    location: '音乐厅',
    organizer: '毕业生组委会',
    status: 'planning',
    description: '2024届毕业生音乐汇报演出',
    instruments: [],
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 3,
    name: '新年交响音乐会',
    date: '2023-12-31',
    location: '学校大礼堂',
    organizer: '校团委',
    status: 'completed',
    description: '2024新年交响音乐会',
    instruments: [],
    createdAt: '2023-12-01T00:00:00Z',
  },
]

export const mockLogin = (username: string, password: string) => {
  const user = mockUsers.find((u) => u.username === username)
  if (user && password === '123456') {
    return {
      code: 200,
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
      },
      message: '登录成功',
    }
  }
  throw new Error('用户名或密码错误')
}

export const getRoleName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: '管理员',
    student: '学生',
    teacher: '指导老师',
    technician: '维修技师',
    performance_manager: '演出负责人',
  }
  return roleMap[role] || '未知角色'
}

export const getInstrumentStatusText = (status: string): string => {
  const map: Record<string, string> = {
    available: '可用',
    borrowed: '借出中',
    maintenance: '保养中',
    repair: '维修中',
    retired: '已报废',
  }
  return map[status] || status
}

export const getInstrumentStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    available: 'green',
    borrowed: 'blue',
    maintenance: 'orange',
    repair: 'red',
    retired: 'default',
  }
  return map[status] || 'default'
}

export const getConditionText = (condition: string): string => {
  const map: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差',
  }
  return map[condition] || condition
}

export const getReservationStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消',
    completed: '已完成',
  }
  return map[status] || status
}

export const getReservationStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    cancelled: 'default',
    completed: 'blue',
  }
  return map[status] || 'default'
}

export const getRoomStatusText = (status: string): string => {
  const map: Record<string, string> = {
    available: '可用',
    occupied: '使用中',
    maintenance: '维护中',
  }
  return map[status] || status
}

export const getRoomStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    available: 'green',
    occupied: 'blue',
    maintenance: 'orange',
  }
  return map[status] || 'default'
}

export const getPriorityText = (priority: string): string => {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return map[priority] || priority
}

export const getPriorityColor = (priority: string): string => {
  const map: Record<string, string> = {
    low: 'default',
    medium: 'blue',
    high: 'orange',
    urgent: 'red',
  }
  return map[priority] || 'default'
}

export const getSeverityText = (severity: string): string => {
  const map: Record<string, string> = {
    minor: '轻微',
    moderate: '中等',
    major: '严重',
    severe: '非常严重',
  }
  return map[severity] || severity
}

export const getSeverityColor = (severity: string): string => {
  const map: Record<string, string> = {
    minor: 'green',
    moderate: 'orange',
    major: 'red',
    severe: 'red',
  }
  return map[severity] || 'default'
}
