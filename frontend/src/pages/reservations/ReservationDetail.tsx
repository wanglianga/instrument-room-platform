import { useState } from 'react'
import { Card, Descriptions, Tag, Button, Space, Divider } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { mockReservations, getReservationStatusText, getReservationStatusColor } from '@/mock'
import dayjs from 'dayjs'

const ReservationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reservation = mockReservations.find((r) => r.id === Number(id))

  if (!reservation) {
    return <div>预约不存在</div>
  }

  return (
    <div>
      <div className="page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/reservations')}
          style={{ marginBottom: 12, paddingLeft: 0 }}
        >
          返回列表
        </Button>
        <h2>预约详情</h2>
      </div>

      <div className="page-content">
        <Space style={{ marginBottom: 16 }}>
          {reservation.status === 'pending' && (
            <>
              <Button type="primary">审核通过</Button>
              <Button danger>审核拒绝</Button>
            </>
          )}
          {reservation.status === 'approved' && (
            <>
              <Button type="primary">归还登记</Button>
            </>
          )}
        </Space>

        <Card title="基本信息">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="预约编号">{reservation.id}</Descriptions.Item>
            <Descriptions.Item label="预约类型">
              {reservation.type === 'instrument' ? '乐器' : reservation.type === 'room' ? '琴房' : '乐器+琴房'}
            </Descriptions.Item>
            <Descriptions.Item label="申请人">{reservation.userName}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getReservationStatusColor(reservation.status)}>
                {getReservationStatusText(reservation.status)}
              </Tag>
            </Descriptions.Item>
            {reservation.instrumentName && (
              <Descriptions.Item label="乐器" span={2}>
                {reservation.instrumentName}
              </Descriptions.Item>
            )}
            {reservation.roomName && (
              <Descriptions.Item label="琴房" span={2}>
                {reservation.roomName}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="开始时间">
              {dayjs(reservation.startTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {dayjs(reservation.endTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="使用用途" span={2}>
              {reservation.purpose}
            </Descriptions.Item>
            <Descriptions.Item label="申请时间" span={2}>
              {dayjs(reservation.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        <Card title="审核信息">
          {reservation.reviewByName ? (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="审核人">{reservation.reviewByName}</Descriptions.Item>
              <Descriptions.Item label="审核时间">
                {reservation.reviewAt ? dayjs(reservation.reviewAt).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核意见" span={2}>
                {reservation.reviewComment || '无'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
              暂无审核信息
            </div>
          )}
        </Card>

        {reservation.actualReturnTime && (
          <>
            <Divider />
            <Card title="归还信息">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="实际归还时间">
                  {dayjs(reservation.actualReturnTime).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="归还时状态">
                  {reservation.returnCondition || '正常'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default ReservationDetail
