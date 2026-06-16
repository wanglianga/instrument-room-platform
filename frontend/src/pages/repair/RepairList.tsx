import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, message, Descriptions, DatePicker, InputNumber } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, CheckOutlined, PlayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockRepairOrders, mockInstruments, mockUsers } from '@/mock'
import type { RepairOrder } from '@/types'

const { Option } = Select
const { TextArea } = Input

const RepairList = () => {
  const [data, setData] = useState<RepairOrder[]>(mockRepairOrders)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [completeVisible, setCompleteVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<RepairOrder | null>(null)
  const [currentItem, setCurrentItem] = useState<RepairOrder | null>(null)
  const [form] = Form.useForm()
  const [completeForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.instrumentName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    const matchStatus = !statusFilter || item.status === statusFilter
    const matchPriority = !priorityFilter || item.priority === priorityFilter
    return matchText && matchStatus && matchPriority
  })

  const technicians = mockUsers.filter((u) => u.role === 'technician')

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleView = (record: RepairOrder) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleStart = (record: RepairOrder) => {
    setData(data.map((item) =>
      item.id === record.id
        ? { ...item, status: 'in_progress', startedAt: new Date().toISOString(), technicianId: 4, technicianName: '王技师' }
        : item
    ))
    message.success('已开始维修')
  }

  const handleComplete = (record: RepairOrder) => {
    setCurrentItem(record)
    completeForm.resetFields()
    setCompleteVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const instrument = mockInstruments.find((i) => i.id === values.instrumentId)
      
      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...values } : item
        ))
        message.success('更新成功')
      } else {
        const newItem: RepairOrder = {
          ...values,
          id: Date.now(),
          instrumentName: instrument?.name || '',
          reporterId: 2,
          reporterName: '张小明',
          status: 'pending',
          reportedAt: new Date().toISOString(),
        }
        setData([newItem, ...data])
        message.success('报修提交成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCompleteSubmit = async () => {
    try {
      const values = await completeForm.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                status: 'completed',
                solution: values.solution,
                cost: values.cost,
                completedAt: new Date().toISOString(),
              }
            : item
        ))
        message.success('维修完成记录已保存')
        setCompleteVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const priorityMap: Record<string, { text: string; color: string }> = {
    low: { text: '低', color: 'default' },
    medium: { text: '中', color: 'blue' },
    high: { text: '高', color: 'orange' },
    urgent: { text: '紧急', color: 'red' },
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'orange' },
    in_progress: { text: '维修中', color: 'processing' },
    completed: { text: '已完成', color: 'success' },
    cancelled: { text: '已取消', color: 'default' },
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '乐器名称',
      dataIndex: 'instrumentName',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priorityMap[priority]?.color}>
          {priorityMap[priority]?.text || priority}
        </Tag>
      ),
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
      title: '报修人',
      dataIndex: 'reporterName',
      width: 100,
    },
    {
      title: '维修技师',
      dataIndex: 'technicianName',
      width: 100,
      render: (name: string) => name || '-',
    },
    {
      title: '故障描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '报修时间',
      dataIndex: 'reportedAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: RepairOrder) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStart(record)}>
              开始
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleComplete(record)}>
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
        <h2>维修管理</h2>
        <p style={{ color: '#8c8c8c' }}>管理维修工单和损坏记录处理</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索乐器名称、故障描述"
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
              <Option value="pending">待处理</Option>
              <Option value="in_progress">维修中</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <Select
              placeholder="优先级筛选"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增报修
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
        title={editingItem ? '编辑报修' : '新增报修'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="instrumentId" label="选择乐器" rules={[{ required: true }]}>
            <Select placeholder="请选择乐器" showSearch optionFilterProp="children">
              {mockInstruments.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name} - {item.brand} {item.model}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]} initialValue="medium">
            <Select>
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="故障描述" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述故障情况" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="维修详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={600}
      >
        {currentItem && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="工单编号">{currentItem.id}</Descriptions.Item>
            <Descriptions.Item label="乐器名称">{currentItem.instrumentName}</Descriptions.Item>
            <Descriptions.Item label="优先级">
              <Tag color={priorityMap[currentItem.priority]?.color}>
                {priorityMap[currentItem.priority]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentItem.status]?.color}>
                {statusMap[currentItem.status]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="报修人">{currentItem.reporterName}</Descriptions.Item>
            <Descriptions.Item label="维修技师">{currentItem.technicianName || '-'}</Descriptions.Item>
            <Descriptions.Item label="故障描述">{currentItem.description}</Descriptions.Item>
            {currentItem.diagnosis && (
              <Descriptions.Item label="诊断结果">{currentItem.diagnosis}</Descriptions.Item>
            )}
            {currentItem.solution && (
              <Descriptions.Item label="解决方案">{currentItem.solution}</Descriptions.Item>
            )}
            {currentItem.cost !== undefined && (
              <Descriptions.Item label="维修费用">¥{currentItem.cost}</Descriptions.Item>
            )}
            <Descriptions.Item label="报修时间">
              {dayjs(currentItem.reportedAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            {currentItem.startedAt && (
              <Descriptions.Item label="开始时间">
                {dayjs(currentItem.startedAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            )}
            {currentItem.completedAt && (
              <Descriptions.Item label="完成时间">
                {dayjs(currentItem.completedAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="完成维修"
        open={completeVisible}
        onOk={handleCompleteSubmit}
        onCancel={() => setCompleteVisible(false)}
        width={600}
        okText="确认完成"
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item name="solution" label="解决方案" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请描述维修方案和维修结果" />
          </Form.Item>
          <Form.Item name="cost" label="维修费用">
            <InputNumber style={{ width: '100%' }} prefix="¥" min={0} placeholder="请输入维修费用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RepairList
