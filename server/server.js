const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

// 加载 .env 文件中的配置到 process.env
require('dotenv').config()

const app = express()
// 从环境变量读取配置，未配置时给出开发环境的默认值
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-not-for-production'
// bcrypt 加盐轮数：轮数越高越安全但越慢，10 是安全与性能的常用平衡点
const SALT_ROUNDS = 10

app.use(cors())
app.use(express.json())

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'users.json')

// 默认初始用户数据（明文密码会在启动时自动哈希化）
const DEFAULT_USERS = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    createdAt: '2024-01-01 10:00:00',
    status: 1
  },
  {
    id: 2,
    username: 'user1',
    password: '123456',
    email: 'user1@example.com',
    name: '张三',
    role: 'user',
    createdAt: '2024-01-02 14:30:00',
    status: 1
  },
  {
    id: 3,
    username: 'user2',
    password: '123456',
    email: 'user2@example.com',
    name: '李四',
    role: 'user',
    createdAt: '2024-01-03 09:15:00',
    status: 1
  },
  {
    id: 4,
    username: 'user3',
    password: '123456',
    email: 'user3@example.com',
    name: '王五',
    role: 'user',
    createdAt: '2024-01-04 16:45:00',
    status: 0
  },
  {
    id: 5,
    username: 'user4',
    password: '123456',
    email: 'user4@example.com',
    name: '赵六',
    role: 'user',
    createdAt: '2024-01-05 11:20:00',
    status: 1
  },
  {
    id: 6,
    username: 'user5',
    password: '123456',
    email: 'user5@example.com',
    name: '孙七',
    role: 'user',
    createdAt: '2024-01-06 13:30:00',
    status: 1
  },
  {
    id: 7,
    username: 'user6',
    password: '123456',
    email: 'user6@example.com',
    name: '周八',
    role: 'user',
    createdAt: '2024-01-07 10:45:00',
    status: 1
  },
  {
    id: 8,
    username: 'user7',
    password: '123456',
    email: 'user7@example.com',
    name: '吴九',
    role: 'user',
    createdAt: '2024-01-08 15:20:00',
    status: 0
  },
  {
    id: 9,
    username: 'user8',
    password: '123456',
    email: 'user8@example.com',
    name: '郑十',
    role: 'user',
    createdAt: '2024-01-09 09:00:00',
    status: 1
  },
  {
    id: 10,
    username: 'user9',
    password: '123456',
    email: 'user9@example.com',
    name: '陈十一',
    role: 'user',
    createdAt: '2024-01-10 11:30:00',
    status: 1
  },
  {
    id: 11,
    username: 'user10',
    password: '123456',
    email: 'user10@example.com',
    name: '黄十二',
    role: 'user',
    createdAt: '2024-01-11 14:00:00',
    status: 1
  },
  {
    id: 12,
    username: 'user11',
    password: '123456',
    email: 'user11@example.com',
    name: '林十三',
    role: 'user',
    createdAt: '2024-01-12 16:30:00',
    status: 0
  },
  {
    id: 13,
    username: 'user12',
    password: '123456',
    email: 'user12@example.com',
    name: '何十四',
    role: 'user',
    createdAt: '2024-01-13 10:15:00',
    status: 1
  },
  {
    id: 14,
    username: 'user13',
    password: '123456',
    email: 'user13@example.com',
    name: '马十五',
    role: 'user',
    createdAt: '2024-01-14 13:45:00',
    status: 1
  },
  {
    id: 15,
    username: 'user14',
    password: '123456',
    email: 'user14@example.com',
    name: '罗十六',
    role: 'user',
    createdAt: '2024-01-15 09:30:00',
    status: 1
  }
]

// 用户数据保存在内存中，每次修改后写回 JSON 文件
let users = []
let nextUserId = 1

// ================= 工具函数 =================

// 剔除敏感字段，只返回可安全暴露给前端的用户信息（最小暴露原则）
function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

// 判断密码是否已是 bcrypt 哈希（bcrypt 哈希固定以 $2a$/$2b$ 开头）
function isBcryptHash(str) {
  return typeof str === 'string' && str.startsWith('$2')
}

// 从文件加载用户数据；文件不存在或损坏时返回 null，由 init() 用默认数据兜底
function loadUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
      return { users: parsed.users, nextUserId: parsed.nextUserId }
    }
  } catch (err) {
    console.error('加载用户数据失败:', err)
  }
  return null
}

// 保存用户数据到文件
function saveUsers(users, nextUserId) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users, nextUserId }, null, 2), 'utf-8')
    console.log('用户数据已保存')
  } catch (err) {
    console.error('保存用户数据失败:', err)
  }
}

// 启动初始化：加载数据 + 把历史明文密码迁移为 bcrypt 哈希（幂等，重复启动安全）
async function init() {
  const loaded = loadUsers()
  if (loaded) {
    users = loaded.users
    nextUserId = loaded.nextUserId
  } else {
    users = [...DEFAULT_USERS]
    nextUserId = DEFAULT_USERS.length + 1
    saveUsers(users, nextUserId)
  }

  let migrated = false
  for (const user of users) {
    if (!isBcryptHash(user.password)) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
      migrated = true
    }
  }
  if (migrated) {
    saveUsers(users, nextUserId)
    console.log('已自动将明文密码迁移为 bcrypt 哈希')
  }
  console.log(`用户数据加载完成，共 ${users.length} 个用户`)
}

// ================= 鉴权中间件 =================

// 校验请求头中的 JWT，并把当前登录用户挂到 req.user 上
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录或登录已过期' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    // 每次请求都从数据源重新查用户，而不是信任 token 里的角色信息：
    // 这样用户被禁用或降级后，旧 token 会立即失效
    const user = users.find(u => u.id === payload.id)
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在，请重新登录' })
    }
    if (user.status === 0) {
      return res.status(401).json({ code: 401, message: '账号已被禁用' })
    }
    req.user = user
    next()
  } catch (err) {
    // token 过期或签名不合法
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' })
  }
}

// 仅管理员可访问（需先经过 authMiddleware）
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ code: 403, message: '无权限访问' })
  }
  next()
}

// 统一错误处理：Express 4 中 async 路由抛出的异常不会自动捕获，统一接住返回 JSON
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('服务器内部错误:', err)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
}

// ================= 公开接口 =================

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username)

  if (!user) {
    return res.status(401).json({ code: 401, message: '用户名或密码错误' })
  }

  // 密码是 bcrypt 哈希，不能用 === 比较，必须通过 compare 校验
  const passwordOk = await bcrypt.compare(password || '', user.password)
  if (!passwordOk) {
    return res.status(401).json({ code: 401, message: '用户名或密码错误' })
  }

  if (user.status === 0) {
    return res.status(401).json({ code: 401, message: '用户已被禁用' })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token,
      user: sanitizeUser(user)
    }
  })
})

app.post('/api/register', async (req, res) => {
  const { username, password, email, name } = req.body

  if (!username || !password || !email || !name) {
    return res.status(400).json({ code: 400, message: '缺少必要参数' })
  }

  // 服务端也做基本校验（前端校验可以绕过，接口不能裸奔）
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ code: 400, message: '密码长度不能少于6位' })
  }

  const existUser = users.find(u => u.username === username || u.email === email)
  if (existUser) {
    return res.status(400).json({ code: 400, message: '用户名或邮箱已存在' })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    email,
    name,
    role: 'user',
    createdAt: new Date().toLocaleString('zh-CN'),
    status: 1
  }

  users.push(newUser)
  saveUsers(users, nextUserId)

  res.json({
    code: 200,
    message: '注册成功',
    data: sanitizeUser(newUser)
  })
})

// 首页统计接口：公开访问（首页无需登录即可浏览）
app.get('/api/stats', (req, res) => {
  const total = users.length
  const active = users.filter(u => u.status === 1).length
  const admin = users.filter(u => u.role === 'admin').length

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      total,
      active,
      admin,
      year: new Date().getFullYear()
    }
  })
})

// ================= 需登录的接口（authMiddleware 之后） =================

app.post('/api/users', authMiddleware, requireAdmin, async (req, res) => {
  const { username, password, email, name } = req.body

  if (!username || !password || !email || !name) {
    return res.status(400).json({ code: 400, message: '缺少必要参数' })
  }

  const existUser = users.find(u => u.username === username || u.email === email)
  if (existUser) {
    return res.status(400).json({ code: 400, message: '用户名或邮箱已存在' })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    email,
    name,
    role: 'user',
    createdAt: new Date().toLocaleString('zh-CN'),
    status: 1
  }

  users.push(newUser)
  saveUsers(users, nextUserId)

  res.json({
    code: 200,
    message: '添加成功',
    data: sanitizeUser(newUser)
  })
})

app.get('/api/users', authMiddleware, requireAdmin, (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query

  let filteredUsers = users

  if (keyword) {
    filteredUsers = filteredUsers.filter(u =>
      u.username.includes(keyword) || u.name.includes(keyword) || u.email.includes(keyword)
    )
  }

  if (status !== '') {
    filteredUsers = filteredUsers.filter(u => u.status === parseInt(status))
  }

  const total = filteredUsers.length
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  const list = filteredUsers.slice(start, end).map(sanitizeUser)

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  })
})

app.get('/api/users/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id)
  // 管理员可以查看任意用户，普通用户只能查看自己
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ code: 403, message: '无权限查看其他用户' })
  }

  const user = users.find(u => u.id === id)
  if (!user) {
    return res.status(404).json({ code: 404, message: '用户不存在' })
  }

  res.json({
    code: 200,
    message: '获取成功',
    data: sanitizeUser(user)
  })
})

app.put('/api/users/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ code: 404, message: '用户不存在' })
  }

  const isSelf = req.user.id === id
  const isAdmin = req.user.role === 'admin'
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ code: 403, message: '无权限操作其他用户' })
  }

  const { name, email, status, role, password } = req.body

  // 普通用户只能修改自己的姓名和邮箱，防止通过接口把自己改成管理员或改别人
  if (isSelf && !isAdmin) {
    if (role || status !== undefined || password) {
      return res.status(403).json({ code: 403, message: '只能修改自己的姓名和邮箱' })
    }
  }

  if (name) users[userIndex].name = name
  if (email) users[userIndex].email = email
  if (isAdmin) {
    if (status !== undefined) users[userIndex].status = status
    if (role) users[userIndex].role = role
    if (password) users[userIndex].password = await bcrypt.hash(password, SALT_ROUNDS)
  }

  saveUsers(users, nextUserId)

  res.json({
    code: 200,
    message: '更新成功',
    data: sanitizeUser(users[userIndex])
  })
})

app.delete('/api/users/:id', authMiddleware, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id)

  // 防止管理员误删自己，导致系统失去管理员
  if (req.user.id === id) {
    return res.status(400).json({ code: 400, message: '不能删除自己的账号' })
  }

  const userIndex = users.findIndex(u => u.id === id)
  if (userIndex === -1) {
    return res.status(404).json({ code: 404, message: '用户不存在' })
  }

  const deletedUser = users.splice(userIndex, 1)[0]
  saveUsers(users, nextUserId)

  res.json({
    code: 200,
    message: '删除成功',
    data: sanitizeUser(deletedUser)
  })
})

app.post('/api/users/:id/change-password', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  // 身份以 token 为准：只能用 token 对应的账号修改密码，防止改别人密码（IDOR 漏洞）
  if (id !== req.user.id) {
    return res.status(403).json({ code: 403, message: '只能修改自己的密码' })
  }

  const userIndex = users.findIndex(u => u.id === id)
  if (userIndex === -1) {
    return res.status(404).json({ code: 404, message: '用户不存在' })
  }

  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ code: 400, message: '缺少必要参数' })
  }

  const passwordOk = await bcrypt.compare(oldPassword, users[userIndex].password)
  if (!passwordOk) {
    return res.status(400).json({ code: 400, message: '旧密码错误' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ code: 400, message: '新密码长度不能少于6位' })
  }

  users[userIndex].password = await bcrypt.hash(newPassword, SALT_ROUNDS)
  saveUsers(users, nextUserId)

  res.json({
    code: 200,
    message: '密码修改成功'
  })
})

// 统一错误处理中间件必须注册在所有路由之后
app.use(errorHandler)

// 数据初始化完成后再启动服务，避免出现"文件还没读好接口就能调"的竞态
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('服务器启动失败:', err)
    process.exit(1)
  })
