# 高校乐器房借用与保养平台（前端）

## 项目简介

高校乐器房借用与保养平台前端项目，基于 React 18 + TypeScript + Vite + Ant Design 5.x 构建。支持多角色（管理员、学生、指导老师、维修技师、演出负责人）登录使用，提供乐器档案管理、琴房管理、预约借用、审核管理、归还检查、调音保养、维修管理、损坏赔偿、演出调拨、用户管理等功能。

## 原始需求

> 在 d:\code\solocoder-0608-wl\wl-334\frontend 目录下创建一个完整的 React 前端项目，用于高校乐器房借用与保养平台。
> 
> 项目核心功能页面：
> 1. 登录页面 - 支持不同角色登录（管理员、学生、指导老师、维修技师、演出负责人）
> 2. 仪表板 - 根据角色显示不同的数据概览
> 3. 乐器档案管理 - 乐器列表、详情、新增、编辑、状态管理
> 4. 琴房管理 - 琴房列表、时段设置
> 5. 预约借用 - 学生预约乐器和琴房、预约列表、预约详情
> 6. 审核管理 - 管理员审核资质、押金、可借时长；指导老师审核贵重乐器外借
> 7. 归还检查 - 归还时检查乐器状态
> 8. 调音保养 - 保养计划、保养记录、调音记录
> 9. 维修管理 - 维修工单、损坏记录、维修技师处理
> 10. 损坏赔偿 - 赔偿记录、赔偿处理
> 11. 演出调拨 - 演出活动、乐器调拨、演出保障
> 12. 用户管理 - 管理员管理用户、角色分配
> 
> 技术要求：
> - 使用 React 18 + TypeScript
> - 使用 Vite 作为构建工具
> - 使用 Ant Design 5.x 作为 UI 组件库
> - 使用 React Router v6 进行路由管理
> - 使用 Axios 进行 HTTP 请求
> - 使用 Zustand 或 Context 进行状态管理
> - 监听端口 5173
> - 响应式设计，支持侧边栏导航
> - 根据用户角色动态显示菜单
> 
> 后端 API 基础地址：http://localhost:3001/api
> 认证方式：Bearer Token
> 
> 请生成完整可运行的项目结构和代码，包括 package.json、tsconfig.json、vite.config.ts、路由配置、页面组件等。返回项目的目录结构和核心文件说明。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design 5.x** - UI 组件库
- **React Router v6** - 路由管理
- **Axios** - HTTP 请求库
- **Zustand** - 状态管理
- **ECharts** - 图表库
- **Day.js** - 日期处理

## 启动方式

### 前置要求

- Node.js >= 16
- npm 或 pnpm

### 启动步骤

#### 1. 安装依赖

```bash
cd frontend
npm install
```

#### 2. 启动开发服务

```bash
npm run dev
```

访问地址：http://localhost:5173

#### 3. 构建生产版本

```bash
npm run build
```

### 测试账号

项目提供以下测试账号（密码均为 `123456`）：

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 学生 | student1 | 123456 |
| 指导老师 | teacher1 | 123456 |
| 维修技师 | tech1 | 123456 |
| 演出负责人 | perf1 | 123456 |

> 注意：当前前端使用 Mock 数据进行演示，实际对接后端 API 后请移除 Mock 相关代码。

## Docker 一键启动

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

### Docker 启动

```bash
cd frontend
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

停止服务：

```bash
docker compose down
```

访问地址：http://localhost:80

## 项目目录结构

```
frontend/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── auth.ts             # 认证相关接口
│   │   ├── instruments.ts      # 乐器管理接口
│   │   ├── rooms.ts            # 琴房管理接口
│   │   ├── reservations.ts     # 预约管理接口
│   │   ├── audit.ts            # 审核管理接口
│   │   ├── maintenance.ts      # 保养管理接口
│   │   ├── repair.ts           # 维修管理接口
│   │   ├── damage.ts           # 损坏赔偿接口
│   │   ├── performance.ts      # 演出调拨接口
│   │   ├── users.ts            # 用户管理接口
│   │   └── dashboard.ts        # 仪表板接口
│   ├── layouts/                # 布局组件
│   │   ├── MainLayout.tsx      # 主布局（侧边栏+顶部栏+内容区）
│   │   ├── menuConfig.ts       # 菜单配置（按角色动态显示）
│   │   └── HeaderUser.tsx      # 顶部用户信息组件
│   ├── pages/                  # 页面组件
│   │   ├── Login.tsx           # 登录页
│   │   ├── Dashboard.tsx       # 仪表板
│   │   ├── instruments/        # 乐器档案管理
│   │   │   ├── InstrumentList.tsx
│   │   │   └── InstrumentDetail.tsx
│   │   ├── rooms/              # 琴房管理
│   │   │   └── RoomList.tsx
│   │   ├── reservations/       # 预约借用
│   │   │   ├── ReservationList.tsx
│   │   │   └── ReservationDetail.tsx
│   │   ├── audit/              # 审核管理
│   │   │   └── AuditList.tsx
│   │   ├── return/             # 归还检查
│   │   │   └── ReturnCheck.tsx
│   │   ├── maintenance/        # 调音保养
│   │   │   └── MaintenanceList.tsx
│   │   ├── repair/             # 维修管理
│   │   │   └── RepairList.tsx
│   │   ├── compensation/       # 损坏赔偿
│   │   │   └── CompensationList.tsx
│   │   ├── performance/        # 演出调拨
│   │   │   └── PerformanceList.tsx
│   │   └── users/              # 用户管理
│   │       └── UserList.tsx
│   ├── store/                  # 状态管理
│   │   └── authStore.ts        # 认证状态（Zustand）
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/                  # 工具函数
│   │   └── request.ts          # Axios 请求封装
│   ├── mock/                   # Mock 数据（演示用）
│   │   └── index.ts
│   ├── styles/                 # 全局样式
│   │   └── global.css
│   ├── App.tsx                 # 应用根组件
│   └── main.tsx                # 应用入口
├── public/                     # 静态资源
├── index.html                  # HTML 模板
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node 环境 TypeScript 配置
├── vite.config.ts              # Vite 配置
├── Dockerfile                  # Docker 构建配置
├── docker-compose.yml          # Docker Compose 配置
├── nginx.conf                  # Nginx 配置
├── .dockerignore               # Docker 忽略文件
└── README.md                   # 项目说明
```

## 核心功能说明

### 1. 登录页面
- 支持用户名密码登录
- 提供角色快捷登录选择
- 登录状态持久化存储

### 2. 仪表板
- 数据统计卡片展示
- 预约趋势图表
- 乐器分类统计
- 最近动态列表

### 3. 乐器档案管理
- 乐器列表展示与筛选
- 新增、编辑、删除乐器
- 乐器详情查看
- 状态管理
- 贵重乐器标识

### 4. 琴房管理
- 琴房列表展示
- 琴房信息维护
- 时段设置功能
- 设施管理

### 5. 预约借用
- 乐器/琴房预约申请
- 预约列表查看
- 预约详情
- 取消预约

### 6. 审核管理
- 资质审核
- 押金审核
- 可借时长审核
- 贵重乐器外借审核
- 审核通过/拒绝

### 7. 归还检查
- 待归还列表
- 归还状态检查
- 损坏记录登记

### 8. 调音保养
- 保养计划管理
- 保养记录查看
- 保养完成登记

### 9. 维修管理
- 维修工单管理
- 故障报修
- 维修进度跟踪
- 维修完成登记

### 10. 损坏赔偿
- 损坏记录管理
- 赔偿处理
- 赔偿确认/免除

### 11. 演出调拨
- 演出活动管理
- 乐器调拨申请
- 调拨状态跟踪

### 12. 用户管理
- 用户列表管理
- 新增/编辑用户
- 角色分配
- 账户状态管理

## 角色权限说明

| 功能模块 | 管理员 | 学生 | 指导老师 | 维修技师 | 演出负责人 |
|---------|--------|------|----------|----------|------------|
| 仪表板 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 乐器档案管理 | ✓ | ✓(查看) | ✓(查看) | ✓(查看) | ✓(查看) |
| 琴房管理 | ✓ | ✓(查看) | ✓(查看) | ✓(查看) | ✓(查看) |
| 预约借用 | ✓ | ✓ | ✓ | - | ✓ |
| 审核管理 | ✓ | - | ✓(贵重乐器) | - | - |
| 归还检查 | ✓ | - | - | ✓ | - |
| 调音保养 | ✓ | - | - | ✓ | - |
| 维修管理 | ✓ | ✓(报修) | ✓(报修) | ✓ | - |
| 损坏赔偿 | ✓ | - | - | - | - |
| 演出调拨 | ✓ | - | - | - | ✓ |
| 用户管理 | ✓ | - | - | - | - |

## 环境变量

可在项目根目录创建 `.env` 文件配置以下环境变量：

```env
VITE_API_BASE_URL=/api
```

- `VITE_API_BASE_URL` - 后端 API 基础地址，默认为 `/api`

## 注意事项

1. 当前版本使用 Mock 数据进行前端演示，对接真实后端时请移除 Mock 相关代码
2. 后端 API 基础地址默认为 `http://localhost:3001/api`，可通过环境变量配置
3. 登录 Token 采用 Bearer Token 方式认证
4. 生产部署建议使用 HTTPS 协议
