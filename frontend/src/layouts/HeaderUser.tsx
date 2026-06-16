import { Avatar, Dropdown, Button, Space } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getRoleName } from '@/store/authStore'

const HeaderUser = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      disabled: true,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space className="user-info">
        <Avatar icon={<UserOutlined />} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            {user?.name || '用户'}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {getRoleName(user?.role || 'student')}
          </div>
        </div>
      </Space>
    </Dropdown>
  )
}

export default HeaderUser
