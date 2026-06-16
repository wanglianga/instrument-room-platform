import { useState } from 'react'
import { Card, Descriptions, Tag, Button, Space, List, Timeline, Divider, Row, Col, Statistic } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import {
  mockInstruments,
  mockMaintenanceRecords,
  mockRepairOrders,
  getInstrumentStatusText,
  getInstrumentStatusColor,
  getConditionText,
} from '@/mock'
import dayjs from 'dayjs'

const InstrumentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const instrument = mockInstruments.find((i) => i.id === Number(id))

  if (!instrument) {
    return <div>乐器不存在</div>
  }

  const maintenanceRecords = mockMaintenanceRecords.filter(
    (m) => m.instrumentId === instrument.id
  )
  const repairOrders = mockRepairOrders.filter(
    (r) => r.instrumentId === instrument.id
  )

  return (
    <div>
      <div className="page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/instruments')}
          style={{ marginBottom: 12, paddingLeft: 0 }}
        >
          返回列表
        </Button>
        <h2>乐器详情</h2>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<EditOutlined />}>编辑信息</Button>
            <Button>状态变更</Button>
            <Button>保养记录</Button>
            <Button>维修记录</Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="基本信息">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="乐器名称">{instrument.name}</Descriptions.Item>
                <Descriptions.Item label="分类">{instrument.category}</Descriptions.Item>
                <Descriptions.Item label="品牌">{instrument.brand}</Descriptions.Item>
                <Descriptions.Item label="型号">{instrument.model}</Descriptions.Item>
                <Descriptions.Item label="序列号">{instrument.serialNumber}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getInstrumentStatusColor(instrument.status)}>
                    {getInstrumentStatusText(instrument.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="成色">{getConditionText(instrument.condition)}</Descriptions.Item>
                <Descriptions.Item label="是否贵重">
                  <Tag color={instrument.isValuable ? 'gold' : 'default'}>
                    {instrument.isValuable ? '是' : '否'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="采购日期">{instrument.purchaseDate}</Descriptions.Item>
                <Descriptions.Item label="采购价格">¥{instrument.purchasePrice.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="存放位置">{instrument.location}</Descriptions.Item>
                <Descriptions.Item label="录入时间">
                  {dayjs(instrument.createdAt).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>
                  {instrument.description || '无'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="保养信息">
              <Statistic
                title="上次保养日期"
                value={instrument.lastMaintenanceDate || '暂无'}
                style={{ marginBottom: 16 }}
              />
              <Statistic
                title="下次保养日期"
                value={instrument.nextMaintenanceDate || '暂无'}
                valueStyle={{ color: instrument.nextMaintenanceDate && dayjs(instrument.nextMaintenanceDate).isBefore(dayjs()) ? '#f5222d' : undefined }}
              />
            </Card>
            <Card title="统计概览" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="保养次数" value={maintenanceRecords.length} />
                </Col>
                <Col span={12}>
                  <Statistic title="维修次数" value={repairOrders.length} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="保养记录">
              {maintenanceRecords.length > 0 ? (
                <List
                  dataSource={maintenanceRecords}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <Tag color="blue">{item.type === 'tuning' ? '调音' : item.type === 'routine' ? '常规保养' : '维修保养'}</Tag>
                            <span>{item.planDate}</span>
                          </Space>
                        }
                        description={item.description}
                      />
                      <Tag color={item.status === 'completed' ? 'green' : item.status === 'in_progress' ? 'orange' : 'default'}>
                        {item.status === 'planned' ? '计划中' : item.status === 'in_progress' ? '进行中' : '已完成'}
                      </Tag>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                  暂无保养记录
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="维修记录">
              {repairOrders.length > 0 ? (
                <Timeline
                  items={repairOrders.map((order) => ({
                    color: order.status === 'completed' ? 'green' : order.status === 'in_progress' ? 'blue' : 'gray',
                    children: (
                      <div>
                        <div style={{ fontWeight: 500 }}>{order.description}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: 4 }}>
                          {dayjs(order.reportedAt).format('YYYY-MM-DD HH:mm')} · {order.reporterName}
                        </div>
                        {order.solution && (
                          <div style={{ marginTop: 8, color: '#52c41a' }}>
                            解决方案：{order.solution}
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                  暂无维修记录
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default InstrumentDetail
