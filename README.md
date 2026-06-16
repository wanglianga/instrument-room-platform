# 高校乐器房借用与保养平台

## 项目简介

本项目是一个面向音乐学院的乐器资产台账管理平台，支持管理员、学生、指导老师、维修技师和演出负责人五种角色协同工作。平台涵盖乐器档案管理、琴房预约、借用审批、押金管理、归还检查、调音保养、损坏赔偿和演出调拨等全流程功能，实现乐器资产的规范化、可追溯管理，避免贵重乐器靠口头交接。

## 原始需求

> 请实现高校乐器房借用与保养平台，React 页面给音乐学院管理员、学生、指导老师、维修技师和演出负责人使用，NestJS 后端保存乐器档案、琴房时段、借用用途、押金、归还检查、调音保养、损坏赔偿和演出调拨。学生按课程、排练、比赛或社团活动预约乐器与房间；管理员核对资质、押金和可借时长；指导老师审核贵重乐器外借；维修技师处理断弦、按键卡滞、音准偏差和结构损伤。这个产品要像学院的乐器资产台账，能区分普通练习、演出保障、维修封存和长期借用，避免贵重乐器靠口头交接。

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5.x
- **UI 组件库**: Ant Design 5.x
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **图表**: ECharts
- **日期处理**: Day.js

### 后端
- **框架**: NestJS 10.x + TypeScript
- **ORM**: TypeORM 0.3.x
- **数据库**: PostgreSQL 15
- **认证**: JWT (@nestjs/jwt + passport-jwt)
- **参数校验**: class-validator + class-transformer
- **密码加密**: bcrypt

## 用户角色

| 角色 | 说明 | 主要权限 |
|------|------|----------|
| **管理员 (admin)** | 系统最高权限 | 用户管理、乐器管理、琴房管理、预约审批、押金管理、全流程管控 |
| **学生 (student)** | 乐器使用者 | 查看乐器/琴房、预约借用、个人记录查询、报修申请 |
| **指导老师 (teacher)** | 教学指导 | 审核贵重乐器外借、确认借还、查看学生使用记录 |
| **维修技师 (technician)** | 乐器维护 | 归还检查、调音保养、维修工单处理、损坏鉴定 |
| **演出负责人 (manager)** | 演出统筹 | 演出活动管理、乐器调拨、演出保障 |

## 功能模块

### 乐器档案管理
- 乐器基本信息（名称、分类、品牌、型号、购买日期、价值）
- 乐器状态追踪（可借/借用中/维修中/封存/演出中）
- 乐器分类（弦乐、管乐、打击乐、键盘乐等）
- 所属琴房关联

### 琴房管理
- 琴房基本信息（编号、位置、容纳人数、设备配置）
- 开放时段设置
- 琴房状态查询

### 预约借用
- 学生按课程、排练、比赛、社团活动预约乐器与琴房
- 预约用途、时间段、押金等信息填写
- 多级审批流程（管理员审批、贵重乐器需指导老师审核）
- 借出确认、归还登记

### 押金管理
- 押金金额设置与缴纳
- 押金退还申请与确认
- 押金扣除（损坏赔偿）

### 归还检查
- 归还时的乐器状态检查
- 损坏情况登记
- 检查记录留存

### 调音保养
- 定期保养计划
- 保养执行记录
- 调音记录
- 维修技师任务分配

### 损坏赔偿
- 损坏记录登记（断弦、按键卡滞、音准偏差、结构损伤等）
- 定损与赔偿金额评估
- 赔偿处理流程
- 案件结案管理

### 演出调拨
- 演出活动创建与管理
- 演出乐器调拨
- 演出保障流程
- 乐器归还与状态恢复

### 乐器状态区分
- **普通练习**: 日常教学和练习使用
- **演出保障**: 演出活动专用调拨
- **维修封存**: 维修中或暂停使用
- **长期借用**: 学期/学年级别的长期借用

## 启动方式

### 前置要求

- Docker & Docker Compose（推荐，一键启动完整环境）
- 或 Node.js >= 18.x + PostgreSQL >= 13（本地开发）

### Docker 一键启动（推荐）

#### 1. 启动完整服务

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

#### 2. 访问服务

- 前端页面: http://localhost
- 后端 API: http://localhost:3001
- PostgreSQL: localhost:5432
  - 用户名: postgres
  - 密码: postgres
  - 数据库: instrument_room

#### 3. 停止服务

```bash
docker compose down
```

如需清除数据卷：

```bash
docker compose down -v
```

### 本地开发启动

#### 后端启动

##### 1. 进入后端目录

```bash
cd backend
```

##### 2. 安装依赖

```bash
npm install
```

##### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

默认配置（如需修改请编辑 `.env`）：

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=instrument_room
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

##### 4. 确保 PostgreSQL 已启动并创建数据库

```sql
CREATE DATABASE instrument_room;
```

##### 5. 启动开发服务器

```bash
npm run start:dev
```

##### 6. 填充种子数据（另开终端）

```bash
npm run seed
```

##### 7. 访问后端 API

访问地址：http://localhost:3001

#### 前端启动

##### 1. 进入前端目录

```bash
cd frontend
```

##### 2. 安装依赖

```bash
npm install
```

##### 3. 启动开发服务器

```bash
npm run dev
```

##### 4. 访问前端页面

访问地址：http://localhost:5173

## 默认测试账号

执行种子数据后，系统会创建以下测试账号，密码均为 `123456`：

| 用户名 | 角色 | 邮箱 |
|--------|------|------|
| admin | 管理员 | admin@example.com |
| student01 | 学生 | student01@example.com |
| student02 | 学生 | student02@example.com |
| teacher01 | 指导老师 | teacher01@example.com |
| technician01 | 维修技师 | technician01@example.com |
| manager01 | 演出负责人 | manager01@example.com |

## 项目目录结构

```
wl-334/
├── backend/                    # NestJS 后端
│   ├── src/
│   │   ├── auth/               # 认证模块
│   │   ├── users/              # 用户模块
│   │   ├── instruments/        # 乐器档案模块
│   │   ├── rooms/              # 琴房模块
│   │   ├── reservations/       # 预约借用模块
│   │   ├── deposits/           # 押金管理模块
│   │   ├── return-checks/      # 归还检查模块
│   │   ├── maintenance/        # 调音保养模块
│   │   ├── damages/            # 损坏赔偿模块
│   │   ├── performances/       # 演出调拨模块
│   │   ├── common/             # 公共模块（装饰器、守卫）
│   │   ├── database/seeds/     # 数据库种子数据
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── api/                # API 接口定义
│   │   ├── layouts/            # 布局组件
│   │   ├── pages/              # 页面组件
│   │   ├── store/              # 状态管理
│   │   ├── styles/             # 全局样式
│   │   ├── types/              # TypeScript 类型
│   │   ├── utils/              # 工具函数
│   │   ├── mock/               # Mock 数据
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── package.json
├── Dockerfile                  # 根目录 Dockerfile（后端构建入口）
├── docker-compose.yml          # 根目录 Docker Compose 编排
├── .dockerignore
├── .gitignore
└── README.md
```

## 根目录 Dockerfile 说明

根目录 `Dockerfile` 用于构建后端服务，作为项目默认构建入口。完整的前后端服务编排请使用根目录的 `docker-compose.yml`。

## 注意事项

1. 生产环境请务必修改 `JWT_SECRET` 为安全的随机字符串
2. 生产环境建议将 TypeORM 的 `synchronize` 设置为 `false`，使用 migrations 管理数据库结构
3. 种子数据中的密码仅用于开发测试，生产环境请提高密码强度
4. 所有接口（除登录外）都需要在请求头中携带 `Authorization: Bearer <token>`
5. 前端默认使用 Mock 数据演示，对接真实后端请移除 `src/mock` 并配置 API 地址
6. Docker 启动时，后端会自动等待 PostgreSQL 健康检查通过后再启动

## 开发命令

### 后端

```bash
# 开发模式
npm run start:dev

# 生产构建
npm run build

# 生产启动
npm run start:prod

# 代码检查
npm run lint

# 格式化
npm run format

# 运行种子数据
npm run seed
```

### 前端

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```
