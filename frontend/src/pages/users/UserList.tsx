import { useState } from 'react'
import { Table, Button, Space, Input, Select, Tag, Modal, Form, Switch, message, InputNumber } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { mockUsers, getRoleName } from '@/mock'
import type { User, UserRole } from '@/types'

const { Option } = Select

const UserList = () => {
  const [data, setData] = useState<User[]>(mockUsers)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: '管理员' },
    { value: 'student', label: '学生' },
    { value: 'teacher', label: '指导老师' },
    { value: 'technician', label: '维修技师' },
    { value: 'performance_manager', label: '演出负责人' },
  ]

  const filteredData = data.filter((item) => {
    const matchText = !searchText ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
    const matchRole = !roleFilter || item.role === roleFilter
    const matchStatus = !statusFilter || item.status === statusFilter
    return matchText && matchRole && matchStatus
  })

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    form.setFieldsValue({ status: true, depositPaid: false })
    setModalVisible(true)
  }

  const handleEdit = (record: User) => {
    setEditingItem(record)
    form.setFieldsValue({
      ...record,
      status: record.status === 'active',
    })
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
      onOk: () => {
        setData(data.filter((item) => item.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const userData = {
        ...values,
        status: values.status ? 'active' : 'inactive',
      }
      delete userData.status
      userData.status = values.status ? 'active' : 'inactive'

      if (editingItem) {
        setData(data.map((item) =>
          item.id === editingItem.id ? { ...item, ...userData } : item
        ))
        message.success('更新成功')
      } else {
        const newItem: User = {
          ...userData,
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
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      render: (role: UserRole) => (
        <Tag color="blue">{getRoleName(role)}</Tag>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '部门/院系',
      dataIndex: 'department',
      width: 120,
    },
    {
      title: '押金',
      dataIndex: 'depositPaid',
      width: 80,
      render: (paid: boolean) => (
        <Tag color={paid ? 'green' : 'orange'}>{paid ? '已缴' : '未缴'}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Space size="small">
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
        <h2>用户管理</h2>
        <p style={{ color: '#8c8c8c' }}>管理系统用户和角色分配</p>
      </div>

      <div className="page-content">
        <div className="table-toolbar">
          <div className="filter-group">
            <Input
              placeholder="搜索用户名、姓名、邮箱"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="角色筛选"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 140 }}
              allowClear
            >
              {roles.map((r) => (
                <Option key={r.value} value={r.value}>{r.label}</Option>
              ))}
            </Select>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title={editingItem ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item name="role" label="角色" rules={[{ required: true }]}>
                <Select placeholder="请选择角色">
                  {roles.map((r) => (
                    <Option key={r.value} value={r.value}>{r.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item name="department" label="部门/院系">
                <Input placeholder="请输入部门" />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item name="email" label="邮箱">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item name="phone" label="电话">
                <Input placeholder="请输入电话" />
              </Form.Item>
            </div>
          </div>
          <Form.Item name="studentId" label="学号/工号">
            <Input placeholder="请输入学号/工号" />
          </Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item name="depositPaid" label="押金已缴纳" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item name="maxBorrowDays" label="最大借用天数">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入最大借用天数" />
              </Form.Item>
            </div>
          </div>
          <Form.Item name="status" label="账户状态" valuePropName="checked">
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserList
