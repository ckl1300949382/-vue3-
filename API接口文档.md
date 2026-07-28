# API 接口文档

> 本文档基于项目源码自动整理，记录了所有可调用的后端接口。
>
> 📁 相关文件：`src/api/user.js`（接口封装）、`src/reques.ts`（axios 配置）、`server/server.js`（后端源码）

---

## 目录

- [基础信息](#基础信息)
- [快速开始](#快速开始)
- [接口详解](#接口详解)
  - [1. 用户登录](#1-用户登录)
  - [2. 用户注册](#2-用户注册)
  - [3. 获取用户列表（分页+搜索）](#3-获取用户列表分页搜索)
  - [4. 添加用户](#4-添加用户)
  - [5. 删除用户](#5-删除用户)
  - [6. 查询单个用户](#6-查询单个用户)
  - [7. 更新用户信息](#7-更新用户信息)
  - [8. 修改密码](#8-修改密码)
- [后端额外接口](#后端额外接口---change-password)
- [9. 获取首页统计数据](#9-获取首页统计数据)
- [前端封装速查表](#前端封装速查表)
- [错误码汇总](#错误码汇总)
- [axios 配置与改进建议](#axios-配置与改进建议)
- [后端技术细节](#后端技术细节)
- [预置用户数据](#预置用户数据)

---

## 基础信息

| 项目         | 值                                |
| ------------ | --------------------------------- |
| 后端地址     | `http://localhost:3001`            |
| 请求头       | `Content-Type: application/json`   |
| 超时时间     | 10 秒                              |
| 统一响应格式 | `{ code: Number, message: String, data?: Object }` |

> ⚠️ **关于响应如何读取**（新手最容易疑惑的地方）：
>
> ```js
> const res = await someApi()
> // res           —— axios 包装的响应对象
> // res.data      —— 后端返回的真实 JSON 数据
> //   .code       —— 状态码（200=成功，其他=错误）
> //   .message    —— 提示消息
> //   .data       —— 实际数据（登录时里面有 token 和 user，列表时里面有 list 和 total）
> ```
>
> 访问链示例：`res.data.data.token`、`res.data.data.list`、`res.data.message`

---

## 快速开始

### 启动项目

```bash
# 1. 启动后端（端口 3001）
node server/server.js

# 2. 启动前端（端口 5173）
npm run dev
```

### 预置测试账号

| 用户名  | 密码   | 角色    | 说明         |
| ------- | ------ | ------- | ------------ |
| `admin` | `123456` | 管理员 | 可访问用户管理页面 |
| `user1` | `123456` | 普通用户 | 可登录查看个人中心 |

---

## 接口详解

---

### 1. 用户登录

- **方法**: `POST`
- **URL**: `/api/login`
- **前端函数**: `userLogin({ username, password })`
- **功能**: 登录成功返回 JWT Token 和用户信息

#### 请求参数

| 参数名     | 类型   | 必填 | 说明                                |
| ---------- | ------ | ---- | ----------------------------------- |
| `username` | string | 是   | 用户名（3-20 字符，支持英文/数字/下划线） |
| `password` | string | 是   | 密码（6-20 字符）                    |

#### 请求示例

```json
{
  "username": "admin",
  "password": "123456"
}
```

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "email": "admin@example.com",
      "role": "admin",
      "status": 1,
      "createdAt": "2024-01-01 10:00:00"
    }
  }
}
```

#### 错误响应

| 状态码 | 响应 message            | 说明           |
| ------ | ----------------------- | -------------- |
| 401    | `用户名或密码错误`       | 账号或密码不对 |
| 401    | `用户已被禁用`           | 该账号被禁止登录 |

#### 前端调用示例

```js
import { userLogin } from '@/api/user'

const res = await userLogin({ username: 'admin', password: '123456' })
if (res.data.code === 200) {
  const { token, user } = res.data.data
  // 保存到 localStorage（供后续页面使用）
  localStorage.setItem('token', token)
  localStorage.setItem('userInfo', JSON.stringify(user))
}
```

---

### 2. 用户注册

- **方法**: `POST`
- **URL**: `/api/register`
- **前端函数**: `userRegister({ username, password, email, name })`
- **功能**: 创建新账户，注册成功后自动跳转到登录页

#### 请求参数

| 参数名     | 类型   | 必填 | 说明                       |
| ---------- | ------ | ---- | -------------------------- |
| `username` | string | 是   | 用户名（3-20 字符）        |
| `password` | string | 是   | 密码（至少 6 位）          |
| `email`    | string | 是   | 邮箱（需符合邮箱格式）     |
| `name`     | string | 是   | 姓名（至少 2 个字符）      |

#### 请求示例

```json
{
  "username": "zhangsan",
  "password": "123456",
  "email": "zhangsan@example.com",
  "name": "张三"
}
```

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 16,
    "username": "zhangsan",
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user"
  }
}
```

#### 错误响应

| 状态码 | 响应 message            | 说明                 |
| ------ | ----------------------- | -------------------- |
| 400    | `缺少必要参数`           | 必填字段未传全       |
| 400    | `用户名或邮箱已存在`      | 用户名或邮箱被占用   |

#### 前端调用示例

```js
import { userRegister } from '@/api/user'

const res = await userRegister({
  username: 'zhangsan',
  password: '123456',
  email: 'zhangsan@example.com',
  name: '张三'
})
if (res.data.code === 200) {
  // 注册成功 → 跳转到登录页
  router.push('/user/login')
}
```

---

### 3. 获取用户列表（分页+搜索）

- **方法**: `GET`
- **URL**: `/api/users?keyword=xxx&page=1&pageSize=10`
- **前端函数**: `manageData(keyword, page = 1, pageSize = 10)`
- **功能**: 分页查询所有用户，支持按用户名/姓名/邮箱关键字搜索（管理员专用）

#### 查询参数

| 参数名     | 类型   | 必填 | 默认值 | 说明                                    |
| ---------- | ------ | ---- | ------ | --------------------------------------- |
| `keyword`  | string | 否   | `''`   | 搜索关键字（模糊匹配用户名/姓名/邮箱）  |
| `page`     | number | 否   | `1`    | 当前页码                                |
| `pageSize` | number | 否   | `10`   | 每页条数                                |
| `status`   | number | 否   | —      | 按状态筛选（`0`=禁用 `1`=正常），前端未用此参数 |

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "password": "123456",
        "name": "管理员",
        "email": "admin@example.com",
        "role": "admin",
        "status": 1,
        "createdAt": "2024-01-01 10:00:00"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 10
  }
}
```

> `data.list` 中的每项都包含 `password` 字段（明文），前端表格中未展示。

#### 前端调用示例

```js
import { manageData } from '@/api/user'

const res = await manageData('zhang', 1, 10)
if (res.data.code === 200) {
  const list = res.data.data.list   // 当前页用户数组
  const total = res.data.data.total // 总记录数（用于分页组件）
}
```

---

### 4. 添加用户

- **方法**: `POST`
- **URL**: `/api/users`
- **前端函数**: `addUser({ username, password, email, name })`
- **功能**: 管理员手动添加新用户（在用户管理页面的弹窗中操作）

#### 请求参数

| 参数名     | 类型   | 必填 | 说明       |
| ---------- | ------ | ---- | ---------- |
| `username` | string | 是   | 用户名     |
| `password` | string | 是   | 密码       |
| `email`    | string | 是   | 邮箱       |
| `name`     | string | 是   | 姓名       |

> ⚠️ 后台注册与添加用户**使用同一套逻辑**，本质上是同一个接口。

#### 请求示例

```json
{
  "username": "lisi",
  "password": "123456",
  "email": "lisi@example.com",
  "name": "李四"
}
```

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 16,
    "username": "lisi",
    "name": "李四",
    "email": "lisi@example.com",
    "role": "user"
  }
}
```

#### 错误响应

| 状态码 | 响应 message            | 说明               |
| ------ | ----------------------- | ------------------ |
| 400    | `缺少必要参数`           | 必填字段未传全     |
| 400    | `用户名或邮箱已存在`      | 用户名或邮箱被占用 |

---

### 5. 删除用户

- **方法**: `DELETE`
- **URL**: `/api/users/:id`
- **前端函数**: `deleteUser(id)`
- **功能**: 根据 ID 删除指定用户

#### 路径参数

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| `id`   | number | 用户 ID  |

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "id": 16,
    "username": "lisi",
    "name": "李四",
    "email": "lisi@example.com",
    "role": "user",
    "createdAt": "2026-07-27 10:00:00",
    "status": 1,
    "password": "123456"
  }
}
```

#### 错误响应

| 状态码 | 响应 message    | 说明         |
| ------ | --------------- | ------------ |
| 404    | `用户不存在`     | ID 对应的用户不存在 |

#### 前端调用示例

```js
import { deleteUser } from '@/api/user'

const res = await deleteUser(16)
if (res.data.code === 200) {
  ElMessage.success('删除成功')
  // 刷新列表
  getManageData()
}
```

---

### 6. 查询单个用户

- **方法**: `GET`
- **URL**: `/api/users/:id`
- **前端函数**: `getUserById(id)`
- **功能**: 根据 ID 获取单个用户的完整信息

> ⚠️ **此接口前端已封装但当前没有被任何页面使用**，属于预留接口。

#### 路径参数

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| `id`   | number | 用户 ID  |

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "admin",
    "password": "123456",
    "name": "管理员",
    "email": "admin@example.com",
    "role": "admin",
    "status": 1,
    "createdAt": "2024-01-01 10:00:00"
  }
}
```

#### 错误响应

| 状态码 | 响应 message    | 说明         |
| ------ | --------------- | ------------ |
| 404    | `用户不存在`     | ID 对应的用户不存在 |

---

### 7. 更新用户信息

- **方法**: `PUT`
- **URL**: `/api/users/:id`
- **前端函数**: `updateUser(id, { name, email, role, status })`
- **功能**: 更新用户的基本信息（**不含密码**，可部分更新）

#### 路径参数

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| `id`   | number | 用户 ID  |

#### 请求参数

| 参数名   | 类型   | 必填 | 说明                                       |
| -------- | ------ | ---- | ------------------------------------------ |
| `name`   | string | 否   | 姓名                                       |
| `email`  | string | 否   | 邮箱                                       |
| `role`   | string | 否   | 角色：`"admin"` 或 `"user"`                |
| `status` | number | 否   | 状态：`1`（正常）或 `0`（禁用）            |

> 后端也支持通过此接口传 `password` 直接改密码，但前端项目统一使用专门的「修改密码」接口（见接口 8）。

#### 请求示例

```json
{
  "name": "新名字",
  "email": "new@example.com",
  "role": "admin",
  "status": 1
}
```

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "新名字",
    "email": "new@example.com",
    "role": "admin",
    "status": 1,
    "createdAt": "2024-01-01 10:00:00",
    "password": "123456"
  }
}
```

#### 错误响应

| 状态码 | 响应 message  | 说明         |
| ------ | ------------- | ------------ |
| 404    | `用户不存在`   | ID 对应的用户不存在 |

#### 前端调用示例（两种场景）

```js
import { updateUser } from '@/api/user'

// 场景1：管理员编辑用户（传完整字段）
const res = await updateUser(1, {
  name: '新名字',
  email: 'new@example.com',
  role: 'admin',
  status: 1
})

// 场景2：个人中心修改自己的信息（只传 name 和 email）
const res2 = await updateUser(userId, {
  name: '我的新名字',
  email: 'mynew@example.com'
})
```

---

### 8. 修改密码

- **方法**: `PUT`
- **URL**: `/api/users/:id/password`
- **前端函数**: `updatePassword(id, { oldPassword, newPassword })`
- **功能**: 在个人中心修改当前用户的密码（需提供旧密码验证）

#### 路径参数

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| `id`   | number | 用户 ID  |

#### 请求参数

| 参数名        | 类型   | 必填 | 说明             |
| ------------- | ------ | ---- | ---------------- |
| `oldPassword` | string | 是   | 旧密码（用以验证） |
| `newPassword` | string | 是   | 新密码（至少 6 位） |

#### 请求示例

```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "密码修改成功"
}
```

#### 错误响应

| 状态码 | 响应 message                 | 说明             |
| ------ | ---------------------------- | ---------------- |
| 400    | `缺少必要参数`                | 旧密码或新密码未传 |
| 400    | `旧密码错误`                  | 旧密码验证不通过 |
| 400    | `新密码长度不能少于6位`        | 新密码太短       |
| 404    | `用户不存在`                  | ID 对应的用户不存在 |

#### 前端调用示例

```js
import { updatePassword } from '@/api/user'

const res = await updatePassword(1, {
  oldPassword: '123456',
  newPassword: '654321'
})
if (res.data.code === 200) {
  ElMessage.success('密码修改成功')
}
```

---

### 后端额外接口 — `/api/users/:id/change-password`

- **方法**: `POST`
- **URL**: `/api/users/:id/change-password`
- **功能**: 后端另一个修改密码的接口（**前端未封装**，前端用的是 `PUT /api/users/:id/password`）

> 请求参数和响应格式与接口 8 完全一致，只是路径和方法不同。如果你想统一，可以任选一个使用。

---

### 9. 获取首页统计数据

- **方法**: `GET`
- **URL**: `/api/stats`
- **前端函数**: `getStats()`
- **功能**: 获取首页展示的统计数据（用户总数、活跃用户数、管理员数等）

#### 成功响应 (200)

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 15,
    "active": 12,
    "admin": 1,
    "year": 2026
  }
}
```

#### 响应字段说明

| 字段名   | 类型   | 说明                         |
| -------- | ------ | ---------------------------- |
| `total`  | number | 用户总数                     |
| `active` | number | 正常状态用户数（status === 1） |
| `admin`  | number | 管理员用户数（role === 'admin'） |
| `year`   | number | 当前年份                     |

#### 前端调用示例

```js
import { getStats } from '@/api/user'

const res = await getStats()
if (res.code === 200) {
  const { total, active, admin, year } = res.data
  // 赋值到页面响应式变量
}
```

---

## 前端封装速查表

| # | 功能       | 方法   | URL                              | 前端函数名         | 使用页面         |
| - | ---------- | ------ | -------------------------------- | ------------------ | ---------------- |
| 1 | 登录       | POST   | `/api/login`                     | `userLogin`        | 登录页           |
| 2 | 注册       | POST   | `/api/register`                  | `userRegister`     | 注册页           |
| 3 | 用户列表   | GET    | `/api/users?keyword=&page=&pageSize=` | `manageData`   | 用户管理         |
| 4 | 添加用户   | POST   | `/api/users`                     | `addUser`          | 用户管理         |
| 5 | 删除用户   | DELETE | `/api/users/:id`                 | `deleteUser`       | 用户管理         |
| 6 | 查询用户   | GET    | `/api/users/:id`                 | `getUserById`      | —（预留，未使用） |
| 7 | 更新用户   | PUT    | `/api/users/:id`                 | `updateUser`       | 用户管理 / 个人中心 |
| 8 | 修改密码   | PUT    | `/api/users/:id/password`        | `updatePassword`   | 个人中心         |
| 9 | 首页统计   | GET    | `/api/stats`                     | `getStats`         | 首页             |

> 后端还有一个 `POST /api/users/:id/change-password` 接口，前端未封装。

---

## 错误码汇总

| HTTP 状态码 | 业务 code | 含义           | 常见场景               |
| ----------- | --------- | -------------- | ---------------------- |
| 200         | 200       | 请求成功       | 所有成功响应           |
| 400         | 400       | 请求参数错误   | 缺少参数、参数重复、密码错误 |
| 401         | 401       | 认证失败       | 用户名或密码错误、账号被禁用 |
| 404         | 404       | 资源不存在     | 查询/更新/删除不存在的用户 |

---

## axios 配置与改进建议

当前 axios 实例在 `src/reques.ts` 中配置：

```js
const instance = axios.create({
  baseURL: 'http://localhost:3001',   // 后端地址
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})
```

### 当前存在的问题

#### 问题 1：没有自动携带 Token

目前请求拦截器是空的，登录后发出的请求**没有带上 Token**。虽然当前后端没有做 Token 验证所以能正常用，但实际项目中应该加上：

```js
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### 问题 2：没有统一错误处理

当请求失败（如网络断开、服务器 500）时，每个页面都要自己写 try-catch。建议加响应拦截器：

```js
instance.interceptors.response.use(
  response => response,
  error => {
    // Token 失效时自动跳登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/user/login'
    }
    return Promise.reject(error)
  }
)
```

#### 问题 3：API 地址硬编码

`http://localhost:3001` 直接写在代码里，上线时改地址不方便。建议移到环境变量：

```bash
# .env.development
VITE_API_BASE=http://localhost:3001

# .env.production
VITE_API_BASE=https://your-api.com
```

```js
// reques.ts
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000
})
```

---

## 后端技术细节

基于 `server/server.js` 中的实现：

| 项目         | 值                              |
| ------------ | ------------------------------- |
| 框架         | Express                         |
| 端口         | 3001                            |
| 跨域         | 已启用（cors 中间件）           |
| 鉴权方式     | JWT（jsonwebtoken）             |
| JWT Secret   | `'your-secret-key-here'`       |
| Token 有效期  | 24 小时                         |
| 数据存储     | 内存数组（**重启后数据丢失**）   |
| 密码存储     | **明文存储**（无加密）          |

> ⚠️ 因为是练手项目，数据存在内存中，**重启后端服务后所有新增/修改的数据都会丢失**，恢复为初始的 15 条预置数据。

---

## 预置用户数据

后端启动时自带 15 个用户，密码默认都是 `123456`：

| ID | 用户名    | 姓名   | 角色    | 邮箱                   | 状态 |
| -- | --------- | ------ | ------- | ---------------------- | ---- |
| 1  | `admin`   | 管理员 | admin   | admin@example.com      | ✅ 正常 |
| 2  | `user1`   | 张三   | user    | user1@example.com      | ✅ 正常 |
| 3  | `user2`   | 李四   | user    | user2@example.com      | ✅ 正常 |
| 4  | `user3`   | 王五   | user    | user3@example.com      | ❌ 禁用 |
| 5  | `user4`   | 赵六   | user    | user4@example.com      | ✅ 正常 |
| 6  | `user5`   | 孙七   | user    | user5@example.com      | ✅ 正常 |
| 7  | `user6`   | 周八   | user    | user6@example.com      | ✅ 正常 |
| 8  | `user7`   | 吴九   | user    | user7@example.com      | ❌ 禁用 |
| 9  | `user8`   | 郑十   | user    | user8@example.com      | ✅ 正常 |
| 10 | `user9`   | 陈十一 | user    | user9@example.com      | ✅ 正常 |
| 11 | `user10`  | 黄十二 | user    | user10@example.com     | ✅ 正常 |
| 12 | `user11`  | 林十三 | user    | user11@example.com     | ❌ 禁用 |
| 13 | `user12`  | 何十四 | user    | user12@example.com     | ✅ 正常 |
| 14 | `user13`  | 马十五 | user    | user13@example.com     | ✅ 正常 |
| 15 | `user14`  | 罗十六 | user    | user14@example.com     | ✅ 正常 |
