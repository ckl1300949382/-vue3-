const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const JWT_SECRET = 'your-secret-key-here'

const users = [
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

let nextUserId = 16

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    })
  }

  if (user.status === 0) {
    return res.status(401).json({
      code: 401,
      message: '用户已被禁用'
    })
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
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    }
  })
})

app.post('/api/register', (req, res) => {
  const { username, password, email, name } = req.body

  if (!username || !password || !email || !name) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数'
    })
  }

  const existUser = users.find(u => u.username === username || u.email === email)
  if (existUser) {
    return res.status(400).json({
      code: 400,
      message: '用户名或邮箱已存在'
    })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password,
    email,
    name,
    role: 'user',
    createdAt: new Date().toLocaleString('zh-CN'),
    status: 1
  }

  users.push(newUser)

  res.json({
    code: 200,
    message: '注册成功',
    data: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  })
})

app.post('/api/users', (req, res) => {
  const { username, password, email, name } = req.body

  if (!username || !password || !email || !name) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数'
    })
  }

  const existUser = users.find(u => u.username === username || u.email === email)
  if (existUser) {
    return res.status(400).json({
      code: 400,
      message: '用户名或邮箱已存在'
    })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password,
    email,
    name,
    role: 'user',
    createdAt: new Date().toLocaleString('zh-CN'),
    status: 1
  }

  users.push(newUser)

  res.json({
    code: 200,
    message: '添加成功',
    data: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  })
})

app.get('/api/users', (req, res) => {
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
  const list = filteredUsers.slice(start, end)

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

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find(u => u.id === id)

  if (!user) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在'
    })
  }

  res.json({
    code: 200,
    message: '获取成功',
    data: user
  })
})

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, status, role, password } = req.body
  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在'
    })
  }

  if (name) users[userIndex].name = name
  if (email) users[userIndex].email = email
  if (status !== undefined) users[userIndex].status = status
  if (role) users[userIndex].role = role
  if (password) users[userIndex].password = password

  res.json({
    code: 200,
    message: '更新成功',
    data: users[userIndex]
  })
})

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在'
    })
  }

  const deletedUser = users.splice(userIndex, 1)[0]

  res.json({
    code: 200,
    message: '删除成功',
    data: deletedUser
  })
})

app.post('/api/users/:id/change-password', (req, res) => {
  const id = parseInt(req.params.id)
  const { oldPassword, newPassword } = req.body

  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在'
    })
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数'
    })
  }

  if (users[userIndex].password !== oldPassword) {
    return res.status(400).json({
      code: 400,
      message: '旧密码错误'
    })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      code: 400,
      message: '新密码长度不能少于6位'
    })
  }

  users[userIndex].password = newPassword

  res.json({
    code: 200,
    message: '密码修改成功'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})