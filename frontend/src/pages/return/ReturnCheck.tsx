import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, Rate, message, Card, Descriptions } from 'antd'
import { CheckOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockReservations } from '@/mock'
import type { Reservation } from '@/types'

const { Option } = Select
const { TextArea } = Input

const ReturnCheck = () => {
  const [data, setData] = useState<Reservation[]>(
    mockReservations.filter((r) => r.status === 'approved')
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<Reservation | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      (item.instrumentName && item.instrumentName.includes(searchText)) ||
      (item.roomName && item.roomName.includes(searchText)) ||
      item.userName.includes(searchText)
    return matchText
  })

  const handleReturn = (record: Reservation) => {
    setCurrentItem(record)
    form.resetFields()
    form.setFieldsValue({ condition: 'good' })
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (currentItem) {
        setData(data.filter((item) => item.id !== currentItem.id))
        message.success('归还登记成功')
        setModalVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const conditionOptions = [
    { value: 'excellent', label: '优秀' },
    { value: 'good', label: '良好' },
    { value: 'fair', label: '一般' },
    { value: 'poor', label: '较差' },
  ]

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
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
      title: '应归还时间',
      dataIndex: 'endTime',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '借用时长',
      key: 'duration',
      width: 120,
      render: (_: any, record: Reservation) => {
        const start = dayjs(record.startTime)
        const end = dayjs(record.endTime)
        const days = end.diff(start, 'day')
        const hours = end.diff(start, 'hour') % 24
        return `${days}天${hours}小时`
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: () => <Tag color="green">借用中</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: Reservation) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleReturn(record)}>
            归还登记
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>归还检查</h2>
        <p style={{ color: '#8c8c8c' }}>归还时检查乐器或琴房状态</p>
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
          </div>
          <div style={{ color: '#8c8c8c' }}>
            待归还：<span style={{ color: '#faad14', fontWeight: 500 }}>{filteredData.length}</span> 条
          </div>
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
        title="归还登记"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确认归还"
      >
        {currentItem && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="申请人">{currentItem.userName}</Descriptions.Item>
                <Descriptions.Item label="预约编号">{currentItem.id}</Descriptions.Item>
                {currentItem.instrumentName && (
                  <Descriptions.Item label="乐器" span={2}>{currentItem.instrumentName}</Descriptions.Item>
                )}
                {currentItem.roomName && (
                  <Descriptions.Item label="琴房" span={2}>{currentItem.roomName}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Form form={form} layout="vertical">
              <Form.Item name="condition" label="归还时状态" rules={[{ required: true }]}>
                <Select>
                  {conditionOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="note" label="备注">
                <TextArea rows={3} placeholder="如有损坏或异常请在此说明" />
              </Form.Item>
              <Form.Item name="hasDamage" label="是否有损坏" valuePropName="checked" initialValue={false}>
                <Select>
                  <Option value={false}>无损坏</Option>
                  <Option value={true}>有损坏（需填写损坏记录）</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReturnCheck
