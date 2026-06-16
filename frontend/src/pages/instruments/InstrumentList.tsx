import { useState } from 'react'
import { Table, Button, Space, Input, Select, Tag, Modal, Form, InputNumber, DatePicker, Switch, message, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  mockInstruments,
  getInstrumentStatusText,
  getInstrumentStatusColor,
  getConditionText,
} from '@/mock'
import type { Instrument } from '@/types'

const { Option } = Select

const InstrumentList = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<Instrument[]>(mockInstruments)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Instrument | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()

  const categories = ['键盘乐器', '弦乐器', '木管乐器', '铜管乐器', '打击乐器', '弹拨乐器']

  const filteredData = data.filter((item) => {
    const matchText = !searchText || 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchText.toLowerCase())
    const matchStatus = !statusFilter || item.status === statusFilter
    const matchCategory = !categoryFilter || item.category === categoryFilter
    return matchText && matchStatus && matchCategory
  })

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Instrument) => {
    setEditingItem(record)
    form.setFieldsValue({
      ...record,
      purchaseDate: record.purchaseDate ? dayjs(record.purchaseDate) : undefined,
      lastMaintenanceDate: record.lastMaintenanceDate ? dayjs(record.lastMaintenanceDate) : undefined,
      nextMaintenanceDate: record.nextMaintenanceDate ? dayjs(record.nextMaintenanceDate) : undefined,
    })
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这件乐器吗？此操作不可恢复。',
      onOk: () => {
        setData(data.filter((item) => item.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        purchaseDate: values.purchaseDate?.format('YYYY-MM-DD'),
        lastMaintenanceDate: values.lastMaintenanceDate?.format('YYYY-MM-DD'),
        nextMaintenanceDate: values.nextMaintenanceDate?.format('YYYY-MM-DD'),
      }

      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...formattedValues } : item
        ))
        message.success('更新成功')
      } else {
        const newItem: Instrument = {
          ...formattedValues,
          id: Date.now(),
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

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '乐器名称',
      dataIndex: 'name',
      render: (text: string, record: Instrument) => (
        <a onClick={() => navigate(`/instruments/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
    },
    {
      title: '品牌/型号',
      render: (_: any, record: Instrument) => (
        <div>
          <div>{record.brand}</div>
          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.model}</div>
        </div>
      ),
    },
    {
      title: '序列号',
      dataIndex: 'serialNumber',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getInstrumentStatusColor(status)}>
          {getInstrumentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '成色',
      dataIndex: 'condition',
      width: 80,
      render: (condition: string) => getConditionText(condition),
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 120,
    },
    {
      title: '是否贵重',
      dataIndex: 'isValuable',
      width: 100,
      render: (val: boolean) => (
        <Tag color={val ? 'gold' : 'default'}>{val ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: Instrument) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/instruments/${record.id}`)}>
            详情
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
        <h2>乐器档案管理</h2>
        <p style={{ color: '#8c8c8c' }}>管理所有乐器的基础信息和状态</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索乐器名称、品牌、序列号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
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
              <Option value="borrowed">借出中</Option>
              <Option value="maintenance">保养中</Option>
              <Option value="repair">维修中</Option>
              <Option value="retired">已报废</Option>
            </Select>
            <Select
              placeholder="分类筛选"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 140 }}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增乐器
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title={editingItem ? '编辑乐器' : '新增乐器'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="乐器名称" rules={[{ required: true }]}>
                <Input placeholder="请输入乐器名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="分类" rules={[{ required: true }]}>
                <Select placeholder="请选择分类">
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand" label="品牌">
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="型号">
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="serialNumber" label="序列号" rules={[{ required: true }]}>
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="purchaseDate" label="采购日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="purchasePrice" label="采购价格">
                <InputNumber style={{ width: '100%' }} placeholder="请输入价格" prefix="¥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue="available">
                <Select>
                  <Option value="available">可用</Option>
                  <Option value="borrowed">借出中</Option>
                  <Option value="maintenance">保养中</Option>
                  <Option value="repair">维修中</Option>
                  <Option value="retired">已报废</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="condition" label="成色" initialValue="good">
                <Select>
                  <Option value="excellent">优秀</Option>
                  <Option value="good">良好</Option>
                  <Option value="fair">一般</Option>
                  <Option value="poor">较差</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="存放位置">
                <Input placeholder="请输入存放位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isValuable" label="贵重乐器" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="roomId" label="所在琴房">
                <Select placeholder="请选择琴房" allowClear>
                  <Option value={1}>A-101 钢琴房</Option>
                  <Option value={2}>A-102 钢琴房</Option>
                  <Option value={3}>B-201 综合练习室</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lastMaintenanceDate" label="上次保养日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nextMaintenanceDate" label="下次保养日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default InstrumentList
