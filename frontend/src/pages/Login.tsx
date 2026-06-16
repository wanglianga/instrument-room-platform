import { useState } from 'react'
import { Form, Input, Button, Select, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { mockLogin } from '@/mock'

const { Option } = Select

const Login = () => {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const roleAccounts = [
    { role: 'admin', username: 'admin', label: '管理员' },
    { role: 'student', username: 'student1', label: '学生' },
    { role: 'teacher', username: 'teacher1', label: '指导老师' },
    { role: 'technician', username: 'tech1', label: '维修技师' },
    { role: 'performance_manager', username: 'perf1', label: '演出负责人' },
  ]

  const handleRoleChange = (value: string) => {
    const account = roleAccounts.find((a) => a.role === value)
    if (account) {
      form.setFieldsValue({
        username: account.username,
        password: '123456',
      })
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const result = mockLogin(values.username, values.password)
      setToken(result.data.token)
      setUser(result.data.user)
      message.success('登录成功')
      navigate('/dashboard')
    } catch (error: any) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">高校乐器房借用与保养平台</h1>
        <p className="login-subtitle">请登录您的账户</p>
        <Form
          form={form}
          name="login"
          initialValues={{ password: '123456', username: 'admin' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="role"
            label="选择角色快速登录"
          >
            <Select
              placeholder="选择角色快速填充"
              onChange={handleRoleChange}
              allowClear
            >
              {roleAccounts.map((account) => (
                <Option key={account.role} value={account.role}>
                  {account.label}（{account.username}）
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: '12px' }}>
            测试密码：123456
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
