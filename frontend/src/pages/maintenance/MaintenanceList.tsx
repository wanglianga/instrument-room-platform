import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, DatePicker, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockMaintenanceRecords, mockInstruments } from '@/mock'
import type { MaintenanceRecord } from '@/types'

const { Option } = Select
const { TextArea } = Input

const MaintenanceList = () => {
  const [data, setData] = useState<MaintenanceRecord[]>(mockMaintenanceRecords)
  const [modalVisible, setModalVisible] = useState(false)
  const [completeVisible, setCompleteVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<MaintenanceRecord | null>(null)
  const [currentItem, setCurrentItem] = useState<MaintenanceRecord | null>(null)
  const [form] = Form.useForm()
  const [completeForm] = Form.useForm()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.instrumentName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    const matchType = !typeFilter || item.type === typeFilter
    const matchStatus = !statusFilter || item.status === status
    return matchText && matchType && matchStatus
  })

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingItem(record)
    form.setFieldsValue({
      ...record,
      planDate: record.planDate ? dayjs(record.planDate) : undefined,
      actualDate: record.actualDate ? dayjs(record.actualDate) : undefined,
      nextMaintenanceDate: record.nextMaintenanceDate ? dayjs(record.nextMaintenanceDate) : undefined,
    })
    setModalVisible(true)
  }

  const handleComplete = (record: MaintenanceRecord) => {
    setCurrentItem(record)
    completeForm.resetFields()
    setCompleteVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        planDate: values.planDate?.format('YYYY-MM-DD'),
        actualDate: values.actualDate?.format('YYYY-MM-DD'),
        nextMaintenanceDate: values.nextMaintenanceDate?.format('YYYY-MM-DD'),
      }

      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...formattedValues } : item
        ))
        message.success('更新成功')
      } else {
        const instrument = mockInstruments.find((i) => i.id === values.instrumentId)
        const newItem: MaintenanceRecord = {
          ...formattedValues,
          id: Date.now(),
          instrumentName: instrument?.name || '',
          status: 'planned',
          createdAt: new Date().toISOString(),
        }
        setData([...data, newItem])
        message.success('添加成功')
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
                result: values.result,
                actualDate: dayjs().format('YYYY-MM-DD'),
                nextMaintenanceDate: values.nextMaintenanceDate?.format('YYYY-MM-DD'),
              }
            : item
        ))
        message.success('保养完成记录已保存')
        setCompleteVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const typeMap: Record<string, string> = {
    routine: '常规保养',
    tuning: '调音',
    repair: '维修保养',
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    planned: { text: '计划中', color: 'default' },
    in_progress: { text: '进行中', color: 'processing' },
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
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => <Tag color="blue">{typeMap[type] || type}</Tag>,
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      width: 120,
    },
    {
      title: '实际日期',
      dataIndex: 'actualDate',
      width: 120,
      render: (date: string) => date || '-',
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
      title: '负责人',
      dataIndex: 'operator',
      width: 100,
      render: (op: string) => op || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: MaintenanceRecord) => (
        <Space size="small">
          {record.status === 'planned' && (
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              编辑
            </Button>
          )}
          {(record.status === 'planned' || record.status === 'in_progress') && (
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
        <h2>调音保养</h2>
        <p style={{ color: '#8c8c8c' }}>管理乐器的保养计划和保养记录</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索乐器名称、描述"
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
              <Option value="routine">常规保养</Option>
              <Option value="tuning">调音</Option>
              <Option value="repair">维修保养</Option>
            </Select>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="planned">计划中</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增保养计划
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
        title={editingItem ? '编辑保养计划' : '新增保养计划'}
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
          <Form.Item name="type" label="保养类型" rules={[{ required: true }]} initialValue="routine">
            <Select>
              <Option value="routine">常规保养</Option>
              <Option value="tuning">调音</Option>
              <Option value="repair">维修保养</Option>
            </Select>
          </Form.Item>
          <Form.Item name="planDate" label="计划日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="operator" label="负责人">
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="description" label="保养内容" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入保养内容描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="完成保养"
        open={completeVisible}
        onOk={handleCompleteSubmit}
        onCancel={() => setCompleteVisible(false)}
        width={600}
        okText="确认完成"
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item name="result" label="保养结果" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请描述保养结果和状态" />
          </Form.Item>
          <Form.Item name="nextMaintenanceDate" label="下次保养日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MaintenanceList
