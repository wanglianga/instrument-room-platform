import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, DatePicker, message, Card, Descriptions, List, InputNumber, Alert, Steps, TimePicker } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, WarningOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { BulkBorrowing, BulkBorrowingItem, BulkBorrowingConflict } from '@/types'

const { Option } = Select
const { TextArea } = Input

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  pending_approval: { text: '待审批', color: 'orange' },
  approved: { text: '已批准', color: 'green' },
  partially_approved: { text: '部分批准', color: 'blue' },
  rejected: { text: '已拒绝', color: 'red' },
  locked: { text: '已锁定', color: 'purple' },
  completed: { text: '已完成', color: 'success' },
  cancelled: { text: '已取消', color: 'default' },
}

const conflictTypeMap: Record<string, string> = {
  instrument_unavailable: '乐器不可用',
  instrument_in_repair: '乐器维修中',
  instrument_sealed: '乐器已封存',
  reservation_conflict: '预约冲突',
  room_conflict: '琴房冲突',
  teacher_approval_required: '需指导老师审批',
}

const severityMap: Record<string, { text: string; color: string }> = {
  error: { text: '严重', color: 'red' },
  warning: { text: '警告', color: 'orange' },
  info: { text: '提示', color: 'blue' },
}

const mockBulkBorrowings: BulkBorrowing[] = [
  {
    id: 1,
    name: '学院春季晚会批量借用',
    programList: '1. 合唱《春天来了》\n2. 交响乐《命运》\n3. 独奏小提琴协奏曲',
    rehearsalSchedule: '4月1日-4月5日 每日18:00-21:00\n4月6日 全天彩排',
    borrowingList: '小提琴x5, 萨克斯x2, 电子琴x1, 架子鼓x1',
    status: 'pending_approval',
    startTime: '2024-04-01T18:00:00Z',
    endTime: '2024-04-06T22:00:00Z',
    organizerId: 5,
    organizerName: '赵演出',
    performanceId: 1,
    performanceName: '2024年春季音乐会',
    notes: '需要全部乐器在3月31日前到位',
    items: [
      { id: 1, bulkBorrowingId: 1, instrumentId: 2, instrumentName: '斯特拉迪瓦里小提琴', quantity: 1, locked: false },
      { id: 2, bulkBorrowingId: 1, instrumentId: 1, instrumentName: '雅马哈三角钢琴', quantity: 1, locked: false },
      { id: 3, bulkBorrowingId: 1, roomId: 3, roomName: 'B-201 综合练习室', quantity: 1, note: '排练场地', locked: false },
    ],
    conflicts: [
      {
        id: 1,
        bulkBorrowingId: 1,
        conflictType: 'reservation_conflict',
        severity: 'warning',
        description: '斯特拉迪瓦里小提琴在4月3日已有弦乐社团预约排练',
        instrumentId: 2,
        suggestion: '调整借用时间或与弦乐社团协调',
        resolved: false,
      },
      {
        id: 2,
        bulkBorrowingId: 1,
        conflictType: 'teacher_approval_required',
        severity: 'info',
        description: '斯特拉迪瓦里小提琴为贵重乐器，需指导老师李老师审批',
        instrumentId: 2,
        suggestion: '已通知指导老师，待审批通过后可继续',
        resolved: false,
      },
    ],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 2,
    name: '省级比赛乐器调拨',
    programList: '1. 弦乐四重奏\n2. 钢琴独奏\n3. 打击乐合奏',
    rehearsalSchedule: '5月10日-5月15日 每日09:00-17:00',
    borrowingList: '小提琴x2, 大提琴x1, 钢琴x1, 打击乐x2',
    status: 'approved',
    startTime: '2024-05-10T09:00:00Z',
    endTime: '2024-05-15T17:00:00Z',
    organizerId: 5,
    organizerName: '赵演出',
    approverId: 3,
    approverName: '李老师',
    approvedAt: '2024-04-01T11:00:00Z',
    notes: '省赛级别，优先保障',
    items: [
      { id: 4, bulkBorrowingId: 2, instrumentId: 2, instrumentName: '斯特拉迪瓦里小提琴', quantity: 1, locked: false },
      { id: 5, bulkBorrowingId: 2, instrumentId: 1, instrumentName: '雅马哈三角钢琴', quantity: 1, locked: false },
    ],
    conflicts: [],
    createdAt: '2024-03-25T14:00:00Z',
    updatedAt: '2024-04-01T11:00:00Z',
  },
  {
    id: 3,
    name: '毕业典礼演出借用',
    status: 'locked',
    startTime: '2024-06-15T08:00:00Z',
    endTime: '2024-06-16T20:00:00Z',
    organizerId: 5,
    organizerName: '赵演出',
    approverId: 1,
    approverName: '管理员',
    approvedAt: '2024-06-01T09:00:00Z',
    items: [
      { id: 6, bulkBorrowingId: 3, instrumentId: 1, instrumentName: '雅马哈三角钢琴', quantity: 1, locked: true },
    ],
    conflicts: [],
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
  },
]

interface MockInstrument {
  id: number
  name: string
  category: string
  status: 'available' | 'borrowed' | 'in_repair' | 'sealed' | 'in_performance'
  totalQuantity: number
  availableQuantity: number
  isValuable: boolean
  currentBorrower?: string
  expectedReturnDate?: string
  repairNote?: string
  sealedReason?: string
  teacherId?: number
  teacherName?: string
}

const mockInstruments: MockInstrument[] = [
  { id: 1, name: '雅马哈三角钢琴', category: '键盘', status: 'available', totalQuantity: 2, availableQuantity: 1, isValuable: true, teacherId: 3, teacherName: '李老师' },
  { id: 2, name: '斯特拉迪瓦里小提琴', category: '弦乐', status: 'available', totalQuantity: 5, availableQuantity: 3, isValuable: true, teacherId: 3, teacherName: '李老师' },
  { id: 3, name: '雅马哈萨克斯', category: '管乐', status: 'in_repair', totalQuantity: 3, availableQuantity: 0, isValuable: false, repairNote: '按键损坏待修', teacherId: 3, teacherName: '李老师' },
  { id: 4, name: '大提琴', category: '弦乐', status: 'available', totalQuantity: 4, availableQuantity: 2, isValuable: false, teacherId: 3, teacherName: '李老师' },
  { id: 5, name: '雅马哈电子琴', category: '键盘', status: 'available', totalQuantity: 6, availableQuantity: 5, isValuable: false, teacherId: 3, teacherName: '李老师' },
  { id: 6, name: '长笛', category: '管乐', status: 'sealed', totalQuantity: 4, availableQuantity: 0, isValuable: false, sealedReason: '夏季封存防潮' },
  { id: 7, name: '架子鼓', category: '打击乐', status: 'borrowed', totalQuantity: 1, availableQuantity: 0, isValuable: false, currentBorrower: '张小明', expectedReturnDate: '2024-04-10' },
  { id: 8, name: '古典吉他', category: '弦乐', status: 'available', totalQuantity: 5, availableQuantity: 5, isValuable: false },
  { id: 9, name: '小提琴（练习）', category: '弦乐', status: 'available', totalQuantity: 10, availableQuantity: 10, isValuable: false },
  { id: 10, name: '中提琴', category: '弦乐', status: 'in_performance', totalQuantity: 3, availableQuantity: 0, isValuable: false },
]

const mockRooms: { id: number; name: string; status: string }[] = [
  { id: 1, name: 'A-101 钢琴房', status: 'available' },
  { id: 2, name: 'A-102 钢琴房', status: 'available' },
  { id: 3, name: 'B-201 综合练习室', status: 'maintenance' },
  { id: 4, name: 'B-202 综合练习室', status: 'available' },
]

const keywordInstrumentMap: Record<string, MockInstrument> = {
  '小提琴': { id: 2, name: '斯特拉迪瓦里小提琴', category: '弦乐', status: 'available', totalQuantity: 5, availableQuantity: 3, isValuable: true, teacherId: 3, teacherName: '李老师' },
  '萨克斯': { id: 3, name: '雅马哈萨克斯', category: '管乐', status: 'in_repair', totalQuantity: 3, availableQuantity: 0, isValuable: false, repairNote: '按键损坏待修' },
  '电子琴': { id: 5, name: '雅马哈电子琴', category: '键盘', status: 'available', totalQuantity: 6, availableQuantity: 5, isValuable: false },
  '钢琴': { id: 1, name: '雅马哈三角钢琴', category: '键盘', status: 'available', totalQuantity: 2, availableQuantity: 1, isValuable: true, teacherId: 3, teacherName: '李老师' },
  '架子鼓': { id: 7, name: '架子鼓', category: '打击乐', status: 'borrowed', totalQuantity: 1, availableQuantity: 0, isValuable: false },
  '大提琴': { id: 4, name: '大提琴', category: '弦乐', status: 'available', totalQuantity: 4, availableQuantity: 2, isValuable: false },
  '长笛': { id: 6, name: '长笛', category: '管乐', status: 'sealed', totalQuantity: 4, availableQuantity: 0, isValuable: false, sealedReason: '夏季封存防潮' },
  '吉他': { id: 8, name: '古典吉他', category: '弦乐', status: 'available', totalQuantity: 5, availableQuantity: 5, isValuable: false },
  '打击乐': { id: 7, name: '架子鼓', category: '打击乐', status: 'borrowed', totalQuantity: 1, availableQuantity: 0, isValuable: false },
}

const keywordRoomMap: Record<string, { id: number; name: string }> = {
  '综合练习室': { id: 3, name: 'B-201 综合练习室' },
  '钢琴房': { id: 1, name: 'A-101 钢琴房' },
  '琴房': { id: 1, name: 'A-101 钢琴房' },
  '排练室': { id: 3, name: 'B-201 综合练习室' },
}

function parseBorrowingList(borrowingList: string): { instrumentItems: BulkBorrowingItem[]; roomItems: BulkBorrowingItem[] } {
  const instrumentItems: BulkBorrowingItem[] = []
  const roomItems: BulkBorrowingItem[] = []
  let itemIdCounter = 10000

  const patterns = [
    /([\u4e00-\u9fa5a-zA-Z]+)[x×](\d+)/g,
    /(\d+)([台把只支个])[\u4e00-\u9fa5a-zA-Z]+/g,
  ]

  const entries: { keyword: string; quantity: number }[] = []
  const parts = borrowingList.split(/[,，、\n;；]/).filter(p => p.trim())

  for (const part of parts) {
    const trimmed = part.trim()
    const match1 = trimmed.match(/^([\u4e00-\u9fa5a-zA-Z]+)[x×\*]\s*(\d+)$/)
    const match2 = trimmed.match(/^(\d+)\s*[台把只支个台套]\s*([\u4e00-\u9fa5a-zA-Z]+)$/)

    if (match1) {
      entries.push({ keyword: match1[1], quantity: parseInt(match1[2]) })
    } else if (match2) {
      entries.push({ keyword: match2[2], quantity: parseInt(match2[1]) })
    }
  }

  for (const entry of entries) {
    let matched = false

    for (const keyword in keywordInstrumentMap) {
      if (entry.keyword.includes(keyword) || keyword.includes(entry.keyword)) {
        const inst = keywordInstrumentMap[keyword]
        instrumentItems.push({
          id: itemIdCounter++,
          bulkBorrowingId: 0,
          instrumentId: inst.id,
          instrumentName: inst.name,
          quantity: entry.quantity,
          locked: false,
        })
        matched = true
        break
      }
    }

    if (!matched) {
      for (const keyword in keywordRoomMap) {
        if (entry.keyword.includes(keyword) || keyword.includes(entry.keyword)) {
          const room = keywordRoomMap[keyword]
          roomItems.push({
            id: itemIdCounter++,
            bulkBorrowingId: 0,
            roomId: room.id,
            roomName: room.name,
            quantity: entry.quantity,
            locked: false,
          })
          matched = true
          break
        }
      }
    }
  }

  return { instrumentItems, roomItems }
}

function generateConflicts(items: BulkBorrowingItem[], startTime: string, endTime: string): BulkBorrowingConflict[] {
  const conflicts: BulkBorrowingConflict[] = []
  let conflictIdCounter = 10000

  for (const item of items) {
    if (item.instrumentId) {
      const inst = mockInstruments.find(i => i.id === item.instrumentId)
      if (!inst) continue

      if (inst.status === 'in_repair') {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'instrument_in_repair',
          severity: 'error',
          description: `"${inst.name}"正在维修中，无法借用（${inst.repairNote || '原因待查'}）`,
          instrumentId: item.instrumentId,
          suggestion: '更换其他同类乐器或等待维修完成',
          resolved: false,
        })
      } else if (inst.status === 'sealed') {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'instrument_sealed',
          severity: 'error',
          description: `"${inst.name}"已封存（${inst.sealedReason || '原因待查'}），无法借用`,
          instrumentId: item.instrumentId,
          suggestion: '联系管理员解除封存或更换乐器',
          resolved: false,
        })
      } else if (inst.status === 'borrowed') {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'instrument_unavailable',
          severity: 'warning',
          description: `"${inst.name}"当前已被${inst.currentBorrower || '他人'}借出，预计${inst.expectedReturnDate || '未知时间'}归还`,
          instrumentId: item.instrumentId,
          suggestion: '确认归还时间或更换其他同类乐器',
          resolved: false,
        })
      } else if (inst.status === 'in_performance') {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'instrument_unavailable',
          severity: 'warning',
          description: `"${inst.name}"正在演出使用中`,
          instrumentId: item.instrumentId,
          suggestion: '确认演出结束时间或更换乐器',
          resolved: false,
        })
      } else if (inst.availableQuantity < item.quantity) {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'instrument_unavailable',
          severity: 'warning',
          description: `"${inst.name}"库存不足：需求${item.quantity}件，可借${inst.availableQuantity}件`,
          instrumentId: item.instrumentId,
          suggestion: `减少借用数量至${inst.availableQuantity}件，或使用练习用替代乐器`,
          resolved: false,
        })
      }

      if (inst.isValuable) {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'teacher_approval_required',
          severity: 'info',
          description: `"${inst.name}"为贵重乐器，需指导老师${inst.teacherName || '指定老师'}审批`,
          instrumentId: item.instrumentId,
          suggestion: '已提交指导老师审批，待通过后可继续',
          resolved: false,
        })
      }

      if (inst.status === 'available' && inst.availableQuantity >= item.quantity && inst.id === 2) {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'reservation_conflict',
          severity: 'warning',
          description: `"${inst.name}"在所选时间段内与弦乐社团排练预约冲突`,
          instrumentId: item.instrumentId,
          suggestion: '调整借用时间或与弦乐社团协调使用时段',
          resolved: false,
        })
      }
    }

    if (item.roomId) {
      const room = mockRooms.find(r => r.id === item.roomId)
      if (room && room.status !== 'available') {
        conflicts.push({
          id: conflictIdCounter++,
          bulkBorrowingId: 0,
          conflictType: 'room_conflict',
          severity: 'error',
          description: `"${room.name}"当前处于${room.status === 'maintenance' ? '维护中' : '使用中'}状态`,
          roomId: item.roomId,
          suggestion: '更换其他琴房或调整使用时间',
          resolved: false,
        })
      }
    }
  }

  return conflicts
}

const BulkBorrowingList = () => {
  const [data, setData] = useState<BulkBorrowing[]>(mockBulkBorrowings)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [addItemVisible, setAddItemVisible] = useState(false)
  const [rejectVisible, setRejectVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<BulkBorrowing | null>(null)
  const [form] = Form.useForm()
  const [addItemForm] = Form.useForm()
  const [rejectForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.organizerName && item.organizerName.includes(searchText))
    const matchStatus = !statusFilter || item.status === statusFilter
    return matchText && matchStatus
  })

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleView = (record: BulkBorrowing) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        startTime: values.timeRange?.[0]?.toISOString(),
        endTime: values.timeRange?.[1]?.toISOString(),
      }

      const { instrumentItems, roomItems } = parseBorrowingList(values.borrowingList)
      const allItems = [...instrumentItems, ...roomItems]
      const conflicts = generateConflicts(allItems, formattedValues.startTime, formattedValues.endTime)

      const newItem: BulkBorrowing = {
        ...formattedValues,
        id: Date.now(),
        status: 'draft',
        organizerId: 5,
        organizerName: '赵演出',
        items: allItems,
        conflicts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData([newItem, ...data])
      message.success(`批量借用申请已创建，自动解析出${allItems.length}项资源，检测到${conflicts.length}个冲突`)
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleDetectConflicts = (record: BulkBorrowing) => {
    const newConflicts = generateConflicts(record.items, record.startTime, record.endTime)
    setData(data.map((item) =>
      item.id === record.id
        ? { ...item, conflicts: newConflicts }
        : item
    ))
    const errorCount = newConflicts.filter(c => c.severity === 'error').length
    const warningCount = newConflicts.filter(c => c.severity === 'warning').length
    const infoCount = newConflicts.filter(c => c.severity === 'info').length
    message.info(`冲突检测完成：${errorCount}个严重，${warningCount}个警告，${infoCount}个提示`)
  }

  const handleSubmitForApproval = (record: BulkBorrowing) => {
    setData(data.map((item) =>
      item.id === record.id ? { ...item, status: 'pending_approval' as const } : item
    ))
    message.success('已提交审批')
  }

  const handleApprove = (record: BulkBorrowing) => {
    setData(data.map((item) =>
      item.id === record.id
        ? { ...item, status: 'approved' as const, approverId: 3, approverName: '李老师', approvedAt: new Date().toISOString() }
        : item
    ))
    message.success('审批通过')
  }

  const handleReject = (record: BulkBorrowing) => {
    setCurrentItem(record)
    rejectForm.resetFields()
    setRejectVisible(true)
  }

  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? { ...item, status: 'rejected' as const, rejectReason: values.reason }
            : item
        ))
        message.success('已拒绝')
        setRejectVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleLock = (record: BulkBorrowing) => {
    setData(data.map((item) =>
      item.id === record.id
        ? {
            ...item,
            status: 'locked' as const,
            items: item.items.map((i) => ({ ...i, locked: true })),
          }
        : item
    ))
    message.success('乐器和琴房已锁定')
  }

  const handleComplete = (record: BulkBorrowing) => {
    setData(data.map((item) =>
      item.id === record.id
        ? {
            ...item,
            status: 'completed' as const,
            items: item.items.map((i) => ({ ...i, locked: false })),
          }
        : item
    ))
    message.success('批量借用已完成，乐器和琴房已释放')
  }

  const handleAddItem = (record: BulkBorrowing) => {
    setCurrentItem(record)
    addItemForm.resetFields()
    setAddItemVisible(true)
  }

  const handleAddItemSubmit = async () => {
    try {
      const values = await addItemForm.validateFields()
      if (currentItem) {
        const newItem: BulkBorrowingItem = {
          id: Date.now(),
          bulkBorrowingId: currentItem.id,
          instrumentId: values.instrumentId,
          instrumentName: values.instrumentId === 1 ? '雅马哈三角钢琴' : values.instrumentId === 2 ? '斯特拉迪瓦里小提琴' : '萨克斯',
          roomId: values.roomId,
          roomName: values.roomId === 1 ? 'A-101 钢琴房' : values.roomId === 3 ? 'B-201 综合练习室' : undefined,
          quantity: values.quantity || 1,
          note: values.note,
          locked: false,
        }
        setData(data.map((item) =>
          item.id === currentItem.id
            ? { ...item, items: [...item.items, newItem] }
            : item
        ))
        message.success('已添加借用项目')
        setAddItemVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getCurrentStep = (status: string) => {
    const stepMap: Record<string, number> = {
      draft: 0,
      pending_approval: 1,
      approved: 2,
      locked: 3,
      completed: 4,
      rejected: 1,
      cancelled: -1,
    }
    return stepMap[status] ?? 0
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 70,
    },
    {
      title: '申请名称',
      dataIndex: 'name',
      render: (text: string, record: BulkBorrowing) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'organizerName',
      width: 100,
    },
    {
      title: '借用时间',
      key: 'time',
      width: 180,
      render: (_: any, record: BulkBorrowing) => (
        <div style={{ fontSize: 12 }}>
          <div>{dayjs(record.startTime).format('MM/DD HH:mm')} ~</div>
          <div>{dayjs(record.endTime).format('MM/DD HH:mm')}</div>
        </div>
      ),
    },
    {
      title: '乐器/琴房',
      dataIndex: 'items',
      width: 120,
      render: (items: BulkBorrowingItem[]) => items.length,
    },
    {
      title: '冲突',
      dataIndex: 'conflicts',
      width: 80,
      render: (conflicts: BulkBorrowingConflict[]) => {
        const unresolved = conflicts.filter(c => !c.resolved)
        return unresolved.length > 0 ? (
          <Tag color="red">{unresolved.length}</Tag>
        ) : (
          <Tag color="green">0</Tag>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: BulkBorrowing) => (
        <Space size="small" wrap>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'draft' && (
            <>
              <Button type="link" size="small" icon={<WarningOutlined />} onClick={() => handleDetectConflicts(record)}>
                冲突检测
              </Button>
              <Button type="link" size="small" onClick={() => handleAddItem(record)}>
                添加项目
              </Button>
              <Button type="link" size="small" onClick={() => handleSubmitForApproval(record)}>
                提交审批
              </Button>
            </>
          )}
          {record.status === 'pending_approval' && (
            <>
              <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => handleApprove(record)}>
                批准
              </Button>
              <Button type="link" size="small" danger onClick={() => handleReject(record)}>
                拒绝
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button type="link" size="small" icon={<LockOutlined />} onClick={() => handleLock(record)}>
              锁定资源
            </Button>
          )}
          {record.status === 'locked' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleComplete(record)}>
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>大型活动批量借用</h2>
        <p style={{ color: '#8c8c8c' }}>学院晚会或比赛集中调拨多件乐器，含冲突检测与资源锁定</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索申请名称、负责人"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="draft">草稿</Option>
              <Option value="pending_approval">待审批</Option>
              <Option value="approved">已批准</Option>
              <Option value="locked">已锁定</Option>
              <Option value="completed">已完成</Option>
              <Option value="rejected">已拒绝</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增批量借用
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title="新增批量借用申请"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="申请名称" rules={[{ required: true }]}>
            <Input placeholder="例如：学院春季晚会批量借用" />
          </Form.Item>
          <Form.Item name="programList" label="节目单" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请列出所有节目，例如：&#10;1. 合唱《春天来了》&#10;2. 交响乐《命运》&#10;3. 独奏小提琴协奏曲" />
          </Form.Item>
          <Form.Item name="rehearsalSchedule" label="排练日程" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请列出排练时间安排" />
          </Form.Item>
          <Form.Item name="borrowingList" label="借用清单" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请列出需要借用的乐器和琴房，例如：小提琴x5, 萨克斯x2" />
          </Form.Item>
          <Form.Item name="timeRange" label="借用时间段" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item name="performanceId" label="关联演出">
            <Select placeholder="选择关联演出（可选）" allowClear>
              <Option value={1}>2024年春季音乐会</Option>
              <Option value={2}>毕业生汇报演出</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="其他需要说明的事项" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量借用详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={800}
      >
        {currentItem && (
          <div>
            <Steps
              current={getCurrentStep(currentItem.status)}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: '填写申请' },
                { title: '指导老师审批' },
                { title: '管理员确认' },
                { title: '资源锁定' },
                { title: '完成归还' },
              ]}
            />

            <Card size="small" title="基本信息" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="申请名称" span={2}>{currentItem.name}</Descriptions.Item>
                <Descriptions.Item label="负责人">{currentItem.organizerName}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusMap[currentItem.status]?.color}>
                    {statusMap[currentItem.status]?.text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="借用时间" span={2}>
                  {dayjs(currentItem.startTime).format('YYYY-MM-DD HH:mm')} ~ {dayjs(currentItem.endTime).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                {currentItem.approverName && (
                  <>
                    <Descriptions.Item label="审批人">{currentItem.approverName}</Descriptions.Item>
                    <Descriptions.Item label="审批时间">
                      {currentItem.approvedAt ? dayjs(currentItem.approvedAt).format('YYYY-MM-DD HH:mm') : '-'}
                    </Descriptions.Item>
                  </>
                )}
                {currentItem.rejectReason && (
                  <Descriptions.Item label="拒绝原因" span={2}>
                    <span style={{ color: '#ff4d4f' }}>{currentItem.rejectReason}</span>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {currentItem.programList && (
              <Card size="small" title="节目单" style={{ marginBottom: 16 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{currentItem.programList}</pre>
              </Card>
            )}

            {currentItem.rehearsalSchedule && (
              <Card size="small" title="排练日程" style={{ marginBottom: 16 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{currentItem.rehearsalSchedule}</pre>
              </Card>
            )}

            <Card size="small" title="借用项目" style={{ marginBottom: 16 }}>
              {currentItem.items.length > 0 ? (
                <List
                  dataSource={currentItem.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <span>
                            {item.instrumentName || item.roomName || `资源 #${item.instrumentId || item.roomId}`}
                            {item.locked && <Tag color="purple" style={{ marginLeft: 8 }}>已锁定</Tag>}
                          </span>
                        }
                        description={`数量：${item.quantity}${item.note ? ' · ' + item.note : ''}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                  暂无借用项目
                </div>
              )}
            </Card>

            {currentItem.conflicts.length > 0 && (
              <Card size="small" title={
                <span>
                  <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  冲突检测结果
                </span>
              }>
                <List
                  dataSource={currentItem.conflicts}
                  renderItem={(conflict) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Tag color={severityMap[conflict.severity]?.color}>
                            {severityMap[conflict.severity]?.text}
                          </Tag>
                        }
                        title={conflictTypeMap[conflict.conflictType] || conflict.conflictType}
                        description={
                          <div>
                            <div>{conflict.description}</div>
                            {conflict.suggestion && (
                              <div style={{ color: '#52c41a', marginTop: 4 }}>
                                建议：{conflict.suggestion}
                              </div>
                            )}
                            {conflict.resolved && <Tag color="green" style={{ marginTop: 4 }}>已解决</Tag>}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="添加借用项目"
        open={addItemVisible}
        onOk={handleAddItemSubmit}
        onCancel={() => setAddItemVisible(false)}
        width={500}
        okText="添加"
      >
        <Form form={addItemForm} layout="vertical">
          <Form.Item name="instrumentId" label="选择乐器">
            <Select placeholder="请选择乐器（可选）" allowClear>
              <Option value={1}>雅马哈三角钢琴</Option>
              <Option value={2}>斯特拉迪瓦里小提琴</Option>
              <Option value={3}>萨克斯</Option>
              <Option value={5}>电子琴</Option>
            </Select>
          </Form.Item>
          <Form.Item name="roomId" label="选择琴房">
            <Select placeholder="请选择琴房（可选）" allowClear>
              <Option value={1}>A-101 钢琴房</Option>
              <Option value={2}>A-102 钢琴房</Option>
              <Option value={3}>B-201 综合练习室</Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="数量" initialValue={1}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="note" label="备注">
            <TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="拒绝批量借用申请"
        open={rejectVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setRejectVisible(false)}
        width={500}
        okText="确认拒绝"
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item name="reason" label="拒绝原因" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入拒绝原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BulkBorrowingList
