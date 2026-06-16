import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, message } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockAudits, mockUsers } from '@/mock'
import type { AuditItem } from '@/types'

const { Option } = Select
const { TextArea } = Input

const AuditList = () => {
  const [data, setData] = useState<AuditItem[]>(mockAudits)
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<AuditItem | null>(null)
  const [actionModalVisible, setActionModalVisible] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [form] = Form.useForm()

  const filteredData = data.filter((item) => {
    const matchType = !typeFilter || item.type === typeFilter
    const matchStatus = !statusFilter || item.status === statusFilter
    return matchType && matchStatus
  })

  const getAuditTypeText = (type: string) => {
    const map: Record<string, string> = {
      qualification: '资质审核',
      deposit: '押金审核',
      borrow_duration: '可借时长',
      valuable_instrument: '贵重乐器外借',
    }
    return map[type] || type
  }

  const getAuditTypeColor = (type: string) => {
    const map: Record<string, string> = {
      qualification: 'blue',
      deposit: 'gold',
      borrow_duration: 'purple',
      valuable_instrument: 'red',
    }
    return map[type] || 'default'
  }

  const handleView = (record: AuditItem) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleApprove = (record: AuditItem) => {
    setCurrentItem(record)
    setActionType('approve')
    form.resetFields()
    setActionModalVisible(true)
  }

  const handleReject = (record: AuditItem) => {
    setCurrentItem(record)
    setActionType('reject')
    form.resetFields()
    setActionModalVisible(true)
  }

  const handleActionSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                status: actionType === 'approve' ? 'approved' : 'rejected',
                reviewerNote: values.note,
                reviewedBy: 1,
                reviewedByName: '系统管理员',
                reviewedAt: new Date().toISOString(),
              }
            : item
        ))
        message.success(actionType === 'approve' ? '审核通过' : '审核拒绝')
      }
      setActionModalVisible(false)
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
      title: '审核类型',
      dataIndex: 'type',
      width: 140,
      render: (type: string) => (
        <Tag color={getAuditTypeColor(type)}>{getAuditTypeText(type)}</Tag>
      ),
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      width: 100,
      render: (role: string) => {
        const map: Record<string, string> = {
          admin: '管理员',
          student: '学生',
          teacher: '指导老师',
          technician: '维修技师',
          performance_manager: '演出负责人',
        }
        return map[role] || role
      },
    },
    {
      title: '相关乐器',
      dataIndex: 'instrumentName',
      render: (name: string) => name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red',
        }
        const textMap: Record<string, string> = {
          pending: '待审核',
          approved: '已通过',
          rejected: '已拒绝',
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      },
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
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: AuditItem) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>
                拒绝
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
        <h2>审核管理</h2>
        <p style={{ color: '#8c8c8c' }}>审核资质、押金、可借时长和贵重乐器外借申请</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Select
              placeholder="类型筛选"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 160 }}
              allowClear
            >
              <Option value="qualification">资质审核</Option>
              <Option value="deposit">押金审核</Option>
              <Option value="borrow_duration">可借时长</Option>
              <Option value="valuable_instrument">贵重乐器外借</Option>
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
        title="审核详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
        ]}
        width={600}
      >
        {currentItem && (
          <div>
            <p><strong>审核类型：</strong>{getAuditTypeText(currentItem.type)}</p>
            <p><strong>申请人：</strong>{currentItem.userName}</p>
            <p><strong>申请说明：</strong>{currentItem.applicantNote || '无'}</p>
            {currentItem.requestedValue && (
              <p><strong>申请值：</strong>{currentItem.requestedValue}</p>
            )}
            {currentItem.reviewedByName && (
              <>
                <p><strong>审核人：</strong>{currentItem.reviewedByName}</p>
                <p><strong>审核时间：</strong>{dayjs(currentItem.reviewedAt!).format('YYYY-MM-DD HH:mm')}</p>
                <p><strong>审核意见：</strong>{currentItem.reviewerNote || '无'}</p>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={actionType === 'approve' ? '审核通过' : '审核拒绝'}
        open={actionModalVisible}
        onOk={handleActionSubmit}
        onCancel={() => setActionModalVisible(false)}
        okText="确认"
        okButtonProps={{ danger: actionType === 'reject' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="note" label="审核意见" rules={[{ required: actionType === 'reject', message: '请填写审核意见' }]}>
            <TextArea rows={4} placeholder={actionType === 'reject' ? '请填写拒绝原因' : '请填写审核意见（选填）'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AuditList
