import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, InputNumber, message } from 'antd'
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockDamageRecords } from '@/mock'
import type { DamageRecord } from '@/types'

const { Option } = Select
const { TextArea } = Input

const CompensationList = () => {
  const [data, setData] = useState<DamageRecord[]>(mockDamageRecords)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<DamageRecord | null>(null)
  const [actionType, setActionType] = useState<'paid' | 'waived'>('paid')
  const [form] = Form.useForm()
  const [severityFilter, setSeverityFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.instrumentName.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.userName && item.userName.includes(searchText))
    const matchSeverity = !severityFilter || item.severity === severityFilter
    const matchStatus = !statusFilter || item.compensationStatus === statusFilter
    return matchText && matchSeverity && matchStatus
  })

  const handleProcess = (record: DamageRecord, type: 'paid' | 'waived') => {
    setCurrentItem(record)
    setActionType(type)
    form.resetFields()
    if (record.compensationAmount) {
      form.setFieldsValue({ amount: record.compensationAmount })
    }
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                compensationStatus: actionType,
                compensationAmount: values.amount,
              }
            : item
        ))
        message.success(actionType === 'paid' ? '赔偿已确认' : '已免除赔偿')
        setModalVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const severityMap: Record<string, { text: string; color: string }> = {
    minor: { text: '轻微', color: 'green' },
    moderate: { text: '中等', color: 'orange' },
    major: { text: '严重', color: 'red' },
    severe: { text: '非常严重', color: 'red' },
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'orange' },
    paid: { text: '已赔偿', color: 'green' },
    waived: { text: '已免除', color: 'default' },
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
      title: '责任人',
      dataIndex: 'userName',
      width: 100,
      render: (name: string) => name || '-',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={severityMap[severity]?.color}>
          {severityMap[severity]?.text || severity}
        </Tag>
      ),
    },
    {
      title: '损坏描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '需赔偿',
      dataIndex: 'compensationRequired',
      width: 80,
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'green'}>{required ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '赔偿金额',
      dataIndex: 'compensationAmount',
      width: 100,
      render: (amount: number) => (amount ? `¥${amount}` : '-'),
    },
    {
      title: '赔偿状态',
      dataIndex: 'compensationStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '发现时间',
      dataIndex: 'discoveredAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: DamageRecord) => (
        <Space size="small">
          {record.compensationRequired && record.compensationStatus === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleProcess(record, 'paid')}
              >
                确认赔偿
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleProcess(record, 'waived')}
              >
                免除
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>损坏赔偿</h2>
        <p style={{ color: '#8c8c8c' }}>管理乐器损坏记录和赔偿处理</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索乐器名称、责任人"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="严重程度"
              value={severityFilter}
              onChange={setSeverityFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="minor">轻微</Option>
              <Option value="moderate">中等</Option>
              <Option value="major">严重</Option>
              <Option value="severe">非常严重</Option>
            </Select>
            <Select
              placeholder="赔偿状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="pending">待处理</Option>
              <Option value="paid">已赔偿</Option>
              <Option value="waived">已免除</Option>
            </Select>
          </div>
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
        title={actionType === 'paid' ? '确认赔偿' : '免除赔偿'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        okButtonProps={{ danger: actionType !== 'paid' }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="损坏记录">
            {currentItem?.description}
          </Form.Item>
          {actionType === 'paid' && (
            <Form.Item name="amount" label="赔偿金额" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} prefix="¥" min={0} placeholder="请输入赔偿金额" />
            </Form.Item>
          )}
          <Form.Item name="note" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CompensationList
