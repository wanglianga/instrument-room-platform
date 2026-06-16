import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, List, Tag, Space } from 'antd'
import {
  AppstoreOutlined,
  HomeOutlined,
  CalendarOutlined,
  AuditOutlined,
  ToolOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useAuthStore } from '@/store/authStore'
import {
  mockInstruments,
  mockRooms,
  mockReservations,
  mockAudits,
  mockRepairOrders,
  getInstrumentStatusColor,
  getReservationStatusText,
  getReservationStatusColor,
} from '@/mock'

const Dashboard = () => {
  const { user } = useAuthStore()

  const stats = {
    totalInstruments: mockInstruments.length,
    availableInstruments: mockInstruments.filter((i) => i.status === 'available').length,
    borrowedInstruments: mockInstruments.filter((i) => i.status === 'borrowed').length,
    maintenanceInstruments: mockInstruments.filter(
      (i) => i.status === 'maintenance' || i.status === 'repair'
    ).length,
    totalRooms: mockRooms.length,
    availableRooms: mockRooms.filter((r) => r.status === 'available').length,
    todayReservations: 3,
    pendingAudits: mockAudits.filter((a) => a.status === 'pending').length,
    pendingRepairs: mockRepairOrders.filter((r) => r.status === 'pending' || r.status === 'in_progress').length,
  }

  const monthlyChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '预约数量',
        type: 'line',
        data: [45, 52, 68, 73, 85, 92],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(22, 119, 255, 0.3)' },
              { offset: 1, color: 'rgba(22, 119, 255, 0.05)' },
            ],
          },
        },
      },
    ],
  }

  const categoryChartOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        name: '乐器分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 15, name: '键盘乐器' },
          { value: 28, name: '弦乐器' },
          { value: 12, name: '木管乐器' },
          { value: 8, name: '铜管乐器' },
          { value: 20, name: '打击乐器' },
          { value: 25, name: '弹拨乐器' },
        ],
      },
    ],
  }

  const recentActivities = [
    { id: 1, type: '预约', content: '张小明 预约了 斯特拉迪瓦里小提琴', time: '10分钟前' },
    { id: 2, type: '归还', content: '李老师 归还了 综合练习室B-201', time: '30分钟前' },
    { id: 3, type: '维修', content: '架子鼓套装 维修完成', time: '1小时前' },
    { id: 4, type: '审核', content: '王小红 提交资质审核申请', time: '2小时前' },
    { id: 5, type: '保养', content: '长笛 季度保养计划已创建', time: '3小时前' },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>欢迎回来，{user?.name}！</h2>
        <p style={{ color: '#8c8c8c' }}>这是您的工作台概览</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="乐器总数"
              value={stats.totalInstruments}
              prefix={<AppstoreOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="可用乐器"
              value={stats.availableInstruments}
              prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="琴房总数"
              value={stats.totalRooms}
              prefix={<HomeOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="今日预约"
              value={stats.todayReservations}
              prefix={<CalendarOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="待审核"
              value={stats.pendingAudits}
              prefix={<AuditOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Statistic
              title="维修中"
              value={stats.pendingRepairs}
              prefix={<ToolOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="预约趋势" extra={<Tag color="blue">近6个月</Tag>}>
            <ReactECharts option={monthlyChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="乐器分类">
            <ReactECharts option={categoryChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Card title="最近动态" style={{ marginTop: 16 }}>
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color="blue">{item.type}</Tag>
                    <span>{item.content}</span>
                  </Space>
                }
                description={item.time}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Dashboard
