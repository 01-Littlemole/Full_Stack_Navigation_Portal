# 部门综合服务平台

全栈导航门户 — 基于 Node.js + Express + SQLite 的轻量级落地中转页系统，支持账号登录管理后台、动态编辑网站标题和导航卡片。

## 技术栈

| 层面 | 技术 |
|------|------|
| 运行时 | Node.js |
| 后端框架 | Express |
| 模板引擎 | EJS |
| 数据库 | SQLite（better-sqlite3，免安装零配置） |
| 鉴权 | express-session + bcryptjs |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动服务
node server.js
```

启动后访问：

- **前台落地页**：<http://localhost:3000>
- **管理后台**：<http://localhost:3000/admin>

### 默认账号

| 账号 | 密码 |
|------|------|
| `admin` | `admin123` |

> 首次启动自动创建数据库文件 `data/portal.db`，并写入预置的 12 张导航卡片。

## 功能

### 前台落地页
- 响应式网格布局，6 / 4 / 2 列自适应
- 玻璃拟态（Glassmorphism）视觉风格
- 卡片图标 SVG 动态渲染
- 卡片名称超出自动滚动显示

### 管理后台
- **网站设置**：编辑大标题和副标题，保存即时生效
- **卡片管理**：增删改导航卡片，调整排序权重
- **图标预设**：内置 20 种 SVG 图标，一键选择
- **自定义 SVG**：支持粘贴任意 SVG 代码，实时预览
- **6 色可选**：蓝 / 青 / 紫 / 橙 / 红 / 绿

## 项目结构

```
落地中转页/
├── server.js              # Express 主入口（路由 + session + API）
├── db.js                  # 数据库初始化 + 预置种子数据
├── auth.js                # 登录鉴权中间件
├── package.json           # 依赖配置
├── views/
│   ├── index.ejs          # 前台落地页模板
│   └── admin/
│       ├── _header.ejs    # 后台共用顶部导航
│       ├── login.ejs      # 登录页
│       ├── dashboard.ejs  # 管理后台首页
│       ├── settings.ejs   # 网站设置页
│       └── cards.ejs      # 卡片管理页
├── public/
│   └── admin.css          # 后台通用样式
└── data/
    └── portal.db          # SQLite 数据库（自动生成）
```

## 数据库表

| 表名 | 说明 |
|------|------|
| `users` | 管理员账号（bcrypt 哈希） |
| `settings` | 键值对配置（site_title, site_subtitle） |
| `cards` | 导航卡片（标题、SVG、颜色、链接、排序） |

## 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 前台落地页 |
| GET | `/admin/login` | 登录页面 |
| POST | `/admin/login` | 登录提交 |
| GET | `/admin/logout` | 退出登录 |
| GET | `/admin` | 管理后台首页（需登录） |
| GET/POST | `/admin/settings` | 网站设置（需登录） |
| GET/POST | `/admin/cards` | 卡片管理（需登录） |
| POST | `/admin/cards/:id/update` | 更新卡片（需登录） |
| POST | `/admin/cards/:id/delete` | 删除卡片（需登录） |

## License

MIT
