import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, DatePicker, message, Card, Descriptions, List, InputNumber } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockPerformances, mockInstruments } from '@/mock'
import type { Performance } from '@/types'

const { Option } = Select
const { TextArea } = Input

const PerformanceList = () => {
  const [data, setData] = useState<Performance[]>(mockPerformances)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [allocVisible, setAllocVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Performance | null>(null)
  const [currentItem, setCurrentItem] = useState<Performance | null>(null)
  const [form] = Form.useForm()
  const [allocForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchText.toLowerCase())
    const matchStatus = !statusFilter || item.status === statusFilter
    return matchText && matchStatus
  })

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Performance) => {
    setEditingItem(record)
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : undefined,
    })
    setModalVisible(true)
  }

  const handleView = (record: Performance) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleAlloc = (record: Performance) => {
    setCurrentItem(record)
    allocForm.resetFields()
    setAllocVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
      }

      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...formattedValues } : item
        ))
        message.success('更新成功')
      } else {
        const newItem: Performance = {
          ...formattedValues,
          id: Date.now(),
          instruments: [],
          createdAt: new Date().toISOString(),
        }
        setData([newItem, ...data])
        message.success('创建成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleAllocSubmit = async () => {
    try {
      const values = await allocForm.validateFields()
      if (currentItem) {
        const instrument = mockInstruments.find((i) => i.id === values.instrumentId)
        const newAlloc = {
          id: Date.now(),
          performanceId: currentItem.id,
          instrumentId: values.instrumentId,
          instrumentName: instrument?.name || '',
          quantity: values.quantity || 1,
          status: 'requested' as const,
          note: values.note,
        }
        setData(data.map((item) =>
          item.id === currentItem.id
            ? { ...item, instruments: [...item.instruments, newAlloc] }
            : item
        ))
        message.success('乐器申请已提交')
        setAllocVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    planning: { text: '筹备中', color: 'blue' },
    ongoing: { text: '进行中', color: 'processing' },
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
      title: '演出名称',
      dataIndex: 'name',
      render: (text: string, record: Performance) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '地点',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '主办方',
      dataIndex: 'organizer',
      width: 120,
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
      title: '调拨乐器数',
      dataIndex: 'instruments',
      width: 100,
      render: (instruments: any[]) => instruments.length,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Performance) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status !== 'completed' && record.status !== 'cancelled' && (
            <Button type="link" size="small" onClick={() => handleAlloc(record)}>
              乐器调拨
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>演出调拨</h2>
        <p style={{ color: '#8c8c8c' }}>管理演出活动和乐器调拨</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索演出名称、主办方"
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
              <Option value="planning">筹备中</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增演出
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
        title={editingItem ? '编辑演出' : '新增演出'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="演出名称" rules={[{ required: true }]}>
            <Input placeholder="请输入演出名称" />
          </Form.Item>
          <Form.Item name="date" label="演出日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="演出地点" rules={[{ required: true }]}>
            <Input placeholder="请输入演出地点" />
          </Form.Item>
          <Form.Item name="organizer" label="主办方" rules={[{ required: true }]}>
            <Input placeholder="请输入主办方" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="planning">
            <Select>
              <Option value="planning">筹备中</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入演出描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="演出详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={700}
      >
        {currentItem && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="演出名称">{currentItem.name}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentItem.status]?.color}>
                  {statusMap[currentItem.status]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="日期">{currentItem.date}</Descriptions.Item>
              <Descriptions.Item label="地点">{currentItem.location}</Descriptions.Item>
              <Descriptions.Item label="主办方">{currentItem.organizer}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(currentItem.createdAt).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {currentItem.description || '无'}
              </Descriptions.Item>
            </Descriptions>
            <Card size="small" title="调拨乐器">
              {currentItem.instruments.length > 0 ? (
                <List
                  dataSource={currentItem.instruments}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.instrumentName}
                        description={`数量：${item.quantity}${item.note ? ' · ' + item.note : ''}`}
                      />
                      <Tag
                        color={item.status === 'allocated' ? 'green' : item.status === 'returned' ? 'default' : 'orange'}
                      >
                        {item.status === 'requested' ? '待调拨' : item.status === 'allocated' ? '已调拨' : '已归还'}
                      </Tag>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                  暂无调拨乐器
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        title="乐器调拨申请"
        open={allocVisible}
        onOk={handleAllocSubmit}
        onCancel={() => setAllocVisible(false)}
        width={500}
        okText="提交申请"
      >
        <Form form={allocForm} layout="vertical">
          <Form.Item name="instrumentId" label="选择乐器" rules={[{ required: true }]}>
            <Select placeholder="请选择乐器" showSearch optionFilterProp="children">
              {mockInstruments.filter((i) => i.status === 'available').map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name} - {item.brand} {item.model}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="数量" initialValue={1}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="note" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PerformanceList
