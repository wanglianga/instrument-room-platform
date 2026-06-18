import { useState } from 'react'
import { Table, Button, Space, Select, Tag, Modal, Form, Input, InputNumber, message, Card, Descriptions, Steps, Upload, Image } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, CameraOutlined, SafetyCertificateOutlined, DollarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ReturnDispute } from '@/types'

const { Option } = Select
const { TextArea } = Input

const disputeTypeMap: Record<string, { text: string; color: string }> = {
  scratch: { text: '划痕', color: 'orange' },
  missing_parts: { text: '缺件', color: 'red' },
  moisture: { text: '受潮', color: 'blue' },
  pitch_abnormal: { text: '音准异常', color: 'purple' },
  other: { text: '其他', color: 'default' },
}

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待审核', color: 'orange' },
  teacher_reviewing: { text: '指导老师审核中', color: 'processing' },
  technician_quoting: { text: '维修技师报价中', color: 'blue' },
  resolved: { text: '已解决', color: 'green' },
  closed: { text: '已关闭', color: 'default' },
}

const impactMap: Record<string, { text: string; color: string }> = {
  affected: { text: '影响演出', color: 'red' },
  not_affected: { text: '不影响演出', color: 'green' },
  needs_assessment: { text: '需进一步评估', color: 'orange' },
}

const mockDisputes: ReturnDispute[] = [
  {
    id: 1,
    disputeType: 'scratch',
    status: 'teacher_reviewing',
    description: '小提琴面板有明显划痕，约5cm长',
    photos: 'violin-scratch-1.jpg',
    instrumentId: 2,
    instrumentName: '斯特拉迪瓦里小提琴',
    reservationId: 1,
    registeredById: 1,
    registeredByName: '管理员',
    teacherId: 3,
    teacherName: '李老师',
    checkoutPhotos: 'violin-checkout-1.jpg',
    createdAt: '2024-04-05T18:00:00Z',
    updatedAt: '2024-04-05T18:30:00Z',
  },
  {
    id: 2,
    disputeType: 'missing_parts',
    status: 'technician_quoting',
    description: '萨克斯缺少吹嘴和哨片',
    instrumentId: 3,
    instrumentName: '萨克斯',
    reservationId: 2,
    registeredById: 1,
    registeredByName: '管理员',
    teacherId: 3,
    teacherName: '李老师',
    performanceImpact: 'affected',
    teacherComment: '缺少吹嘴严重影响近期演出排练',
    teacherReviewedAt: '2024-04-06T10:00:00Z',
    technicianId: 4,
    technicianName: '王技师',
    repairQuote: 350,
    technicianComment: '更换吹嘴和哨片，约350元',
    technicianQuotedAt: '2024-04-06T14:00:00Z',
    createdAt: '2024-04-05T20:00:00Z',
    updatedAt: '2024-04-06T14:00:00Z',
  },
  {
    id: 3,
    disputeType: 'moisture',
    status: 'pending',
    description: '电子琴键盘区域有明显受潮痕迹，部分按键失灵',
    instrumentId: 5,
    instrumentName: '雅马哈电子琴',
    reservationId: 3,
    registeredById: 1,
    registeredByName: '管理员',
    checkoutPhotos: 'keyboard-checkout-1.jpg',
    createdAt: '2024-04-07T09:00:00Z',
    updatedAt: '2024-04-07T09:00:00Z',
  },
  {
    id: 4,
    disputeType: 'pitch_abnormal',
    status: 'resolved',
    description: '小提琴E弦音准偏差较大，无法正常调音',
    instrumentId: 2,
    instrumentName: '斯特拉迪瓦里小提琴',
    reservationId: 4,
    registeredById: 1,
    registeredByName: '管理员',
    teacherId: 3,
    teacherName: '李老师',
    performanceImpact: 'not_affected',
    teacherComment: '可使用备用乐器，不影响下周演出',
    teacherReviewedAt: '2024-04-03T11:00:00Z',
    technicianId: 4,
    technicianName: '王技师',
    repairQuote: 120,
    technicianComment: '琴弦老化需更换，含调音费用',
    technicianQuotedAt: '2024-04-03T15:00:00Z',
    deductedAmount: 120,
    resolutionNote: '从押金中扣除维修费用120元',
    resolvedAt: '2024-04-03T16:00:00Z',
    createdAt: '2024-04-02T17:00:00Z',
    updatedAt: '2024-04-03T16:00:00Z',
  },
]

const instrumentMap: Record<number, string> = {
  1: '雅马哈三角钢琴',
  2: '斯特拉迪瓦里小提琴',
  3: '萨克斯',
  4: '大提琴',
  5: '雅马哈电子琴',
  6: '长笛',
}

const checkoutPhotoMap: Record<number, string> = {
  1: 'piano-checkout-default.jpg',
  2: 'violin-checkout-default.jpg',
  3: 'saxophone-checkout-default.jpg',
  4: 'cello-checkout-default.jpg',
  5: 'keyboard-checkout-default.jpg',
  6: 'flute-checkout-default.jpg',
}

const DisputeList = () => {
  const [data, setData] = useState<ReturnDispute[]>(mockDisputes)
  const [detailVisible, setDetailVisible] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)
  const [reviewVisible, setReviewVisible] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [resolveVisible, setResolveVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<ReturnDispute | null>(null)
  const [createForm] = Form.useForm()
  const [reviewForm] = Form.useForm()
  const [quoteForm] = Form.useForm()
  const [resolveForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      (item.instrumentName && item.instrumentName.includes(searchText)) ||
      item.description.includes(searchText)
    const matchStatus = !statusFilter || item.status === statusFilter
    const matchType = !typeFilter || item.disputeType === typeFilter
    return matchText && matchStatus && matchType
  })

  const handleView = (record: ReturnDispute) => {
    setCurrentItem(record)
    setDetailVisible(true)
  }

  const handleCreate = () => {
    createForm.resetFields()
    setCreateVisible(true)
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      const instrumentName = instrumentMap[values.instrumentId] || `乐器#${values.instrumentId}`
      const checkoutPhotos = checkoutPhotoMap[values.instrumentId] || ''
      const newItem: ReturnDispute = {
        ...values,
        id: Date.now(),
        instrumentName,
        checkoutPhotos,
        status: 'pending',
        registeredById: 1,
        registeredByName: '管理员',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData([newItem, ...data])
      message.success('争议登记成功，相关押金已冻结')
      setCreateVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleTeacherReview = (record: ReturnDispute) => {
    setCurrentItem(record)
    reviewForm.resetFields()
    setReviewVisible(true)
  }

  const handleReviewSubmit = async () => {
    try {
      const values = await reviewForm.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                status: values.performanceImpact === 'needs_assessment' ? 'teacher_reviewing' : 'technician_quoting',
                teacherId: 3,
                teacherName: '李老师',
                performanceImpact: values.performanceImpact,
                teacherComment: values.comment,
                teacherReviewedAt: new Date().toISOString(),
              }
            : item
        ))
        message.success('指导老师审核完成')
        setReviewVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleTechnicianQuote = (record: ReturnDispute) => {
    setCurrentItem(record)
    quoteForm.resetFields()
    setQuoteVisible(true)
  }

  const handleQuoteSubmit = async () => {
    try {
      const values = await quoteForm.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                technicianId: 4,
                technicianName: '王技师',
                repairQuote: values.repairQuote,
                technicianComment: values.comment,
                technicianQuotedAt: new Date().toISOString(),
              }
            : item
        ))
        message.success('维修报价已提交')
        setQuoteVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleResolve = (record: ReturnDispute) => {
    setCurrentItem(record)
    resolveForm.resetFields()
    if (record.repairQuote) {
      resolveForm.setFieldsValue({ deductedAmount: record.repairQuote })
    }
    setResolveVisible(true)
  }

  const handleResolveSubmit = async () => {
    try {
      const values = await resolveForm.validateFields()
      if (currentItem) {
        setData(data.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                status: 'resolved',
                deductedAmount: values.deductedAmount,
                resolutionNote: values.resolutionNote,
                resolvedAt: new Date().toISOString(),
              }
            : item
        ))
        message.success('争议已解决')
        setResolveVisible(false)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getCurrentStep = (status: string) => {
    const stepMap: Record<string, number> = {
      pending: 0,
      teacher_reviewing: 1,
      technician_quoting: 2,
      resolved: 3,
      closed: 3,
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
      title: '争议类型',
      dataIndex: 'disputeType',
      width: 100,
      render: (type: string) => (
        <Tag color={disputeTypeMap[type]?.color}>
          {disputeTypeMap[type]?.text || type}
        </Tag>
      ),
    },
    {
      title: '乐器名称',
      dataIndex: 'instrumentName',
      width: 150,
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '演出影响',
      dataIndex: 'performanceImpact',
      width: 110,
      render: (impact: string) => impact ? (
        <Tag color={impactMap[impact]?.color}>
          {impactMap[impact]?.text || impact}
        </Tag>
      ) : <span style={{ color: '#8c8c8c' }}>待评估</span>,
    },
    {
      title: '维修报价',
      dataIndex: 'repairQuote',
      width: 100,
      render: (quote: number) => quote ? `¥${quote}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '登记时间',
      dataIndex: 'createdAt',
      width: 150,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right' as const,
      render: (_: any, record: ReturnDispute) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {(record.status === 'pending' || record.status === 'teacher_reviewing') && (
            <Button type="link" size="small" icon={<SafetyCertificateOutlined />} onClick={() => handleTeacherReview(record)}>
              审核影响
            </Button>
          )}
          {record.status === 'technician_quoting' && !record.repairQuote && (
            <Button type="link" size="small" icon={<DollarOutlined />} onClick={() => handleTechnicianQuote(record)}>
              报价
            </Button>
          )}
          {record.status === 'technician_quoting' && record.repairQuote && (
            <Button type="link" size="small" onClick={() => handleResolve(record)}>
              解决
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>归还验收分歧</h2>
        <p style={{ color: '#8c8c8c' }}>乐器归还时发现划痕、缺件、受潮或音准异常的争议处理</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索乐器名称、问题描述"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="争议类型"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 130 }}
              allowClear
            >
              <Option value="scratch">划痕</Option>
              <Option value="missing_parts">缺件</Option>
              <Option value="moisture">受潮</Option>
              <Option value="pitch_abnormal">音准异常</Option>
              <Option value="other">其他</Option>
            </Select>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="pending">待审核</Option>
              <Option value="teacher_reviewing">指导老师审核中</Option>
              <Option value="technician_quoting">维修技师报价中</Option>
              <Option value="resolved">已解决</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            登记争议
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title="登记归还争议"
        open={createVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setCreateVisible(false)}
        width={650}
        okText="确认登记"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="disputeType" label="争议类型" rules={[{ required: true }]}>
            <Select placeholder="请选择争议类型">
              <Option value="scratch">划痕</Option>
              <Option value="missing_parts">缺件</Option>
              <Option value="moisture">受潮</Option>
              <Option value="pitch_abnormal">音准异常</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="instrumentId" label="乐器" rules={[{ required: true }]}>
            <Select placeholder="请选择争议乐器">
              <Option value={2}>斯特拉迪瓦里小提琴</Option>
              <Option value={3}>萨克斯</Option>
              <Option value={5}>电子琴</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reservationId" label="关联预约" rules={[{ required: true }]}>
            <Select placeholder="请选择关联预约">
              <Option value={1}>预约 #1 - 张小明</Option>
              <Option value={2}>预约 #2 - 张小明</Option>
              <Option value={3}>预约 #3 - 赵演出</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="问题描述" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请详细描述发现的问题" />
          </Form.Item>
          <Form.Item name="photos" label="问题照片">
            <Upload listType="picture-card" maxCount={5}>
              <div><CameraOutlined /><div style={{ marginTop: 8 }}>上传照片</div></div>
            </Upload>
          </Form.Item>
          <Form.Item name="checkoutPhotos" label="借出前验收照片（追溯）">
            <Upload listType="picture-card" maxCount={5}>
              <div><CameraOutlined /><div style={{ marginTop: 8 }}>上传照片</div></div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="争议详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={750}
      >
        {currentItem && (
          <div>
            <Steps
              current={getCurrentStep(currentItem.status)}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: '管理员登记' },
                { title: '指导老师审核' },
                { title: '维修技师报价' },
                { title: '争议解决' },
              ]}
            />
            <Card size="small" title="基本信息" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="争议编号">{currentItem.id}</Descriptions.Item>
                <Descriptions.Item label="争议类型">
                  <Tag color={disputeTypeMap[currentItem.disputeType]?.color}>
                    {disputeTypeMap[currentItem.disputeType]?.text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="乐器名称" span={2}>{currentItem.instrumentName}</Descriptions.Item>
                <Descriptions.Item label="问题描述" span={2}>{currentItem.description}</Descriptions.Item>
                <Descriptions.Item label="登记人">{currentItem.registeredByName}</Descriptions.Item>
                <Descriptions.Item label="登记时间">{dayjs(currentItem.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
              </Descriptions>
            </Card>

            {currentItem.checkoutPhotos && (
              <Card size="small" title="借出前验收照片（追溯）" style={{ marginBottom: 16 }}>
                <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 12 }}>
                  以下为管理员借出时拍摄的验收照片，用于比对归还时状态
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Image.PreviewGroup>
                    <Image width={80} height={80} src="https://via.placeholder.com/80/1677ff/ffffff?text=正面" />
                    <Image width={80} height={80} src="https://via.placeholder.com/80/52c41a/ffffff?text=背面" />
                    <Image width={80} height={80} src="https://via.placeholder.com/80/faad14/ffffff?text=侧面" />
                    <Image width={80} height={80} src="https://via.placeholder.com/80/722ed1/ffffff?text=细节" />
                  </Image.PreviewGroup>
                </div>
                <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 8 }}>
                  照片拍摄时间：借出当日 09:30 · 拍摄人：管理员
                </div>
              </Card>
            )}

            {currentItem.teacherId && (
              <Card size="small" title="指导老师审核" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small" bordered>
                  <Descriptions.Item label="审核老师">{currentItem.teacherName}</Descriptions.Item>
                  <Descriptions.Item label="审核时间">
                    {currentItem.teacherReviewedAt ? dayjs(currentItem.teacherReviewedAt).format('YYYY-MM-DD HH:mm') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="演出影响">
                    {currentItem.performanceImpact ? (
                      <Tag color={impactMap[currentItem.performanceImpact]?.color}>
                        {impactMap[currentItem.performanceImpact]?.text}
                      </Tag>
                    ) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="审核意见">{currentItem.teacherComment || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {currentItem.technicianId && (
              <Card size="small" title="维修技师报价" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small" bordered>
                  <Descriptions.Item label="维修技师">{currentItem.technicianName}</Descriptions.Item>
                  <Descriptions.Item label="报价时间">
                    {currentItem.technicianQuotedAt ? dayjs(currentItem.technicianQuotedAt).format('YYYY-MM-DD HH:mm') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="维修报价">
                    {currentItem.repairQuote ? `¥${currentItem.repairQuote}` : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="报价说明">{currentItem.technicianComment || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {currentItem.status === 'resolved' && (
              <Card size="small" title="解决结果" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small" bordered>
                  <Descriptions.Item label="扣除金额">
                    {currentItem.deductedAmount ? `¥${currentItem.deductedAmount}` : '¥0'}
                  </Descriptions.Item>
                  <Descriptions.Item label="解决时间">
                    {currentItem.resolvedAt ? dayjs(currentItem.resolvedAt).format('YYYY-MM-DD HH:mm') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="处理说明" span={2}>{currentItem.resolutionNote || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="指导老师审核 - 判断是否影响演出"
        open={reviewVisible}
        onOk={handleReviewSubmit}
        onCancel={() => setReviewVisible(false)}
        width={550}
        okText="提交审核"
      >
        {currentItem && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="乐器">{currentItem.instrumentName}</Descriptions.Item>
                <Descriptions.Item label="问题描述">{currentItem.description}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Form form={reviewForm} layout="vertical">
              <Form.Item name="performanceImpact" label="是否影响近期演出" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  <Option value="affected">影响演出 - 需要优先维修</Option>
                  <Option value="not_affected">不影响演出 - 可后续处理</Option>
                  <Option value="needs_assessment">需进一步评估</Option>
                </Select>
              </Form.Item>
              <Form.Item name="comment" label="审核意见" rules={[{ required: true }]}>
                <TextArea rows={3} placeholder="请输入审核意见" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal
        title="维修技师报价"
        open={quoteVisible}
        onOk={handleQuoteSubmit}
        onCancel={() => setQuoteVisible(false)}
        width={550}
        okText="提交报价"
      >
        {currentItem && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="乐器">{currentItem.instrumentName}</Descriptions.Item>
                <Descriptions.Item label="问题描述">{currentItem.description}</Descriptions.Item>
                <Descriptions.Item label="演出影响">
                  {currentItem.performanceImpact ? (
                    <Tag color={impactMap[currentItem.performanceImpact]?.color}>
                      {impactMap[currentItem.performanceImpact]?.text}
                    </Tag>
                  ) : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Form form={quoteForm} layout="vertical">
              <Form.Item name="repairQuote" label="维修报价（元）" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} prefix="¥" placeholder="请输入维修报价" />
              </Form.Item>
              <Form.Item name="comment" label="报价说明" rules={[{ required: true }]}>
                <TextArea rows={3} placeholder="请输入报价说明" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal
        title="解决争议"
        open={resolveVisible}
        onOk={handleResolveSubmit}
        onCancel={() => setResolveVisible(false)}
        width={550}
        okText="确认解决"
      >
        {currentItem && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="乐器">{currentItem.instrumentName}</Descriptions.Item>
                <Descriptions.Item label="维修报价">{currentItem.repairQuote ? `¥${currentItem.repairQuote}` : '-'}</Descriptions.Item>
                <Descriptions.Item label="技师说明" span={2}>{currentItem.technicianComment || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Form form={resolveForm} layout="vertical">
              <Form.Item name="deductedAmount" label="从押金扣除金额（元）" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} prefix="¥" placeholder="请输入扣除金额" />
              </Form.Item>
              <Form.Item name="resolutionNote" label="处理说明" rules={[{ required: true }]}>
                <TextArea rows={3} placeholder="请输入处理说明" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DisputeList
