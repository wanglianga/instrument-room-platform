import { useState } from 'react'
import { Table, Button, Space, Input, Select, Tag, Modal, Form, InputNumber, message, Card, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons'
import { mockRooms, getRoomStatusText, getRoomStatusColor } from '@/mock'
import type { Room } from '@/types'

const { Option } = Select

const RoomList = () => {
  const [data, setData] = useState<Room[]>(mockRooms)
  const [modalVisible, setModalVisible] = useState(false)
  const [timeSlotVisible, setTimeSlotVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Room | null>(null)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()

  const roomTypes = ['钢琴房', '综合练习室', '声乐教室', '打击乐教室', '管弦乐教室']

  const filteredData = data.filter((item) => {
    const matchText = !searchText || 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase())
    const matchStatus = !statusFilter || item.status === statusFilter
    const matchType = !typeFilter || item.type === typeFilter
    return matchText && matchStatus && matchType
  })

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Room) => {
    setEditingItem(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleTimeSlots = (record: Room) => {
    setCurrentRoom(record)
    setTimeSlotVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个琴房吗？',
      onOk: () => {
        setData(data.filter((item) => item.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...values } : item
        ))
        message.success('更新成功')
      } else {
        const newItem: Room = {
          ...values,
          id: Date.now(),
          timeSlots: [],
        }
        setData([...data, newItem])
        message.success('添加成功')
      }
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
      title: '琴房名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 120,
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getRoomStatusColor(status)}>
          {getRoomStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '设施',
      dataIndex: 'facilities',
      render: (facilities: string[]) => (
        <Space wrap>
          {facilities.slice(0, 3).map((f) => (
            <Tag key={f}>{f}</Tag>
          ))}
          {facilities.length > 3 && <Tag>+{facilities.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Room) => (
        <Space size="small">
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleTimeSlots(record)}>
            时段
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>琴房管理</h2>
        <p style={{ color: '#8c8c8c' }}>管理琴房信息和可用时段</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索琴房名称、位置"
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
              <Option value="available">可用</Option>
              <Option value="occupied">使用中</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
            <Select
              placeholder="类型筛选"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 140 }}
              allowClear
            >
              {roomTypes.map((type) => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增琴房
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title={editingItem ? '编辑琴房' : '新增琴房'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="琴房名称" rules={[{ required: true }]}>
                <Input placeholder="请输入琴房名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  {roomTypes.map((type) => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="位置">
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="容纳人数">
                <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入容纳人数" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" initialValue="available">
            <Select>
              <Option value="available">可用</Option>
              <Option value="occupied">使用中</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="时段设置"
        open={timeSlotVisible}
        onCancel={() => setTimeSlotVisible(false)}
        onOk={() => { setTimeSlotVisible(false); message.success('保存成功') }}
        width={700}
      >
        {currentRoom && (
          <div>
            <p style={{ marginBottom: 16 }}>
              琴房：<strong>{currentRoom.name}</strong>
            </p>
            <Card size="small" title="每周开放时段">
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ width: 60 }}>{day}</span>
                  <Tag color="green">08:00 - 12:00</Tag>
                  <Tag color="green" style={{ marginLeft: 8 }}>14:00 - 18:00</Tag>
                  <Tag color="green" style={{ marginLeft: 8 }}>19:00 - 22:00</Tag>
                </div>
              ))}
            </Card>
            <p style={{ color: '#8c8c8c', marginTop: 16, fontSize: '12px' }}>
              提示：时段设置功能正在开发中，当前为默认开放时段
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RoomList
