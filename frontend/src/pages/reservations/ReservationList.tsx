import { useState } from 'react'
import { Table, Button, Space, Input, Select, Tag, Modal, Form, DatePicker, message, Card, Row, Col, Descriptions } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  mockReservations,
  getReservationStatusText,
  getReservationStatusColor,
  mockInstruments,
  mockRooms,
} from '@/mock'
import type { Reservation } from '@/types'

const { Option } = Select
const { RangePicker } = DatePicker

const ReservationList = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<Reservation[]>(mockReservations)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<Reservation | null>(null)
  const [form] = Form.useForm()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      (item.instrumentName && item.instrumentName.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.roomName && item.roomName.toLowerCase().includes(searchText.toLowerCase())) ||
      item.userName.toLowerCase().includes(searchText.toLowerCase())
    const matchType = !typeFilter || item.type === typeFilter
    const matchStatus = !statusFilter || item.status === status
    return matchText && matchType && matchStatus
  })

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleView = (record: Reservation) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleCancel = (id: number) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      onOk: () => {
        setData(data.map((item) =>
          item.id === id ? { ...item, status: 'cancelled' } : item
        ))
        message.success('取消成功')
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const [start, end] = values.timeRange
      
      const newItem: Reservation = {
        id: Date.now(),
        userId: 2,
        userName: '张小明',
        type: values.type,
        instrumentId: values.instrumentId,
        instrumentName: values.type === 'instrument' || values.type === 'both'
          ? mockInstruments.find((i) => i.id === values.instrumentId)?.name
          : undefined,
        roomId: values.roomId,
        roomName: values.type === 'room' || values.type === 'both'
          ? mockRooms.find((r) => r.id === values.roomId)?.name
          : undefined,
        purpose: values.purpose,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      
      setData([newItem, ...data])
      message.success('预约提交成功，等待审核')
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '预约类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          instrument: '乐器',
          room: '琴房',
          both: '乐器+琴房',
        }
        return typeMap[type] || type
      },
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '乐器/琴房',
      key: 'item',
      render: (_: any, record: Reservation) => (
        <div>
          {record.instrumentName && <div>{record.instrumentName}</div>}
          {record.roomName && <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.roomName}</div>}
        </div>
      ),
    },
    {
      title: '预约时段',
      key: 'time',
      width: 220,
      render: (_: any, record: Reservation) => (
        <div>
          <div>{dayjs(record.startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
            至 {dayjs(record.endTime).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getReservationStatusColor(status)}>
          {getReservationStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: Reservation) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleCancel(record.id)}>
              取消
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>预约借用</h2>
        <p style={{ color: '#8c8c8c' }}>预约乐器和琴房的使用</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索申请人、乐器、琴房"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="类型筛选"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="instrument">乐器</Option>
              <Option value="room">琴房</Option>
              <Option value="both">乐器+琴房</Option>
            </Select>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
              <Option value="cancelled">已取消</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建预约
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title="新建预约"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="预约类型" rules={[{ required: true }]} initialValue="instrument">
            <Select>
              <Option value="instrument">仅乐器</Option>
              <Option value="room">仅琴房</Option>
              <Option value="both">乐器+琴房</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.type !== curr.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type')
              const showInstrument = type === 'instrument' || type === 'both'
              const showRoom = type === 'room' || type === 'both'

              return (
                <>
                  {showInstrument && (
                    <Form.Item name="instrumentId" label="选择乐器" rules={[{ required: true }]}>
                      <Select placeholder="请选择乐器" showSearch optionFilterProp="children">
                        {mockInstruments.filter((i) => i.status === 'available').map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name} - {item.brand} {item.model}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  {showRoom && (
                    <Form.Item name="roomId" label="选择琴房" rules={[{ required: true }]}>
                      <Select placeholder="请选择琴房" showSearch optionFilterProp="children">
                        {mockRooms.filter((r) => r.status === 'available').map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name} ({item.type})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </>
              )
            }}
          </Form.Item>

          <Form.Item name="timeRange" label="预约时段" rules={[{ required: true }]}>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <Form.Item name="purpose" label="使用用途" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请输入使用用途" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="预约详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {currentItem && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="预约编号">{currentItem.id}</Descriptions.Item>
            <Descriptions.Item label="预约类型">
              {currentItem.type === 'instrument' ? '乐器' : currentItem.type === 'room' ? '琴房' : '乐器+琴房'}
            </Descriptions.Item>
            <Descriptions.Item label="申请人">{currentItem.userName}</Descriptions.Item>
            {currentItem.instrumentName && (
              <Descriptions.Item label="乐器">{currentItem.instrumentName}</Descriptions.Item>
            )}
            {currentItem.roomName && (
              <Descriptions.Item label="琴房">{currentItem.roomName}</Descriptions.Item>
            )}
            <Descriptions.Item label="开始时间">
              {dayjs(currentItem.startTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {dayjs(currentItem.endTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="用途">{currentItem.purpose}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getReservationStatusColor(currentItem.status)}>
                {getReservationStatusText(currentItem.status)}
              </Tag>
            </Descriptions.Item>
            {currentItem.reviewByName && (
              <Descriptions.Item label="审核人">{currentItem.reviewByName}</Descriptions.Item>
            )}
            {currentItem.reviewComment && (
              <Descriptions.Item label="审核意见">{currentItem.reviewComment}</Descriptions.Item>
            )}
            <Descriptions.Item label="申请时间">
              {dayjs(currentItem.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default ReservationList
