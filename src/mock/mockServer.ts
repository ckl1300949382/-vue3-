import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { BizResult, PageData } from '@/types/api'
import type { UserVO } from '@/types/user'

/**
 * 演示模式（Mock 后端）
 *
 * 为什么需要它：
 *   GitHub Pages 只能托管静态前端文件，访客的浏览器访问不到我们电脑上运行的后端。
 *   因此在生产构建（npm run build）下，把 axios 的 adapter 替换成这里的"内存后端"：
 *   请求不出网，直接返回与真实后端完全一致的 { code, message, data } 结构，
 *   登录 / 数据看板 / 用户管理增删改查全部可以离线演示。
 *
 * 数据存放：浏览器 localStorage，访客的增删改查刷新后仍然保留；
 *           清除浏览器站点数据即可恢复初始演示数据。
 *
 * 演示账号：admin / 123456（种子用户密码统一为 123456）
 */

// ==================== 数据层 ====================

interface UserRow extends UserVO {
  password: string // 明文仅用于演示环境
}

const DB_KEY = 'demo_users_db'
const DEFAULT_PASSWORD = '123456'

// 36 个种子用户的注册时间：近 12 个月、近期偏多 → 月度/趋势图表呈自然增长
const SEED_DATES = [
  // 2026-08（8 人，落在近 30 天趋势内）
  '2026-08-02 09:12:00', '2026-08-05 14:30:00', '2026-08-08 10:05:00', '2026-08-11 20:41:00',
  '2026-08-14 11:23:00', '2026-08-18 16:54:00', '2026-08-22 09:47:00', '2026-08-26 18:33:00',
  // 2026-07（5）
  '2026-07-03 10:15:00', '2026-07-09 15:32:00', '2026-07-15 09:28:00', '2026-07-21 19:06:00', '2026-07-28 12:40:00',
  // 2026-06（4）
  '2026-06-05 11:11:00', '2026-06-12 14:26:00', '2026-06-19 17:09:00', '2026-06-26 08:55:00',
  // 2026-05（4）
  '2026-05-08 10:34:00', '2026-05-15 13:48:00', '2026-05-22 16:21:00', '2026-05-29 09:39:00',
  // 2026-04（3）
  '2026-04-06 10:52:00', '2026-04-17 15:17:00', '2026-04-25 18:44:00',
  // 2026-03（3）
  '2026-03-05 09:26:00', '2026-03-14 14:03:00', '2026-03-23 20:15:00',
  // 2026-02（2）
  '2026-02-07 11:38:00', '2026-02-19 16:29:00',
  // 2026-01（2）
  '2026-01-08 10:46:00', '2026-01-20 13:57:00',
  // 2025-12 ~ 2025-10（各 1）
  '2025-12-12 15:24:00', '2025-11-15 11:02:00', '2025-10-10 09:31:00', '2025-09-20 14:49:00'
]

const SEED_NAMES = [
  '张伟', '王芳', '李娜', '刘强', '陈静', '杨洋', '赵敏', '黄磊', '周杰', '吴敏',
  '徐磊', '孙丽', '马超', '朱婷', '胡军', '郭靖', '林芳', '何平', '高飞', '罗成',
  '郑爽', '梁波', '宋佳', '唐磊', '许晴', '韩雪', '冯军', '邓超', '曹颖', '彭飞',
  '董洁', '袁泉', '蔡明', '潘越', '杜鹏'
]

function buildSeed(): UserRow[] {
  const rows: UserRow[] = [
    {
      id: 1, username: 'admin', password: DEFAULT_PASSWORD,
      email: 'admin@example.com', name: '管理员',
      role: 'admin', status: 1, createdAt: '2025-09-01 09:00:00'
    }
  ]
  SEED_NAMES.forEach((name, i) => {
    const username = `user${String(i + 1).padStart(2, '0')}`
    rows.push({
      id: i + 2,
      username,
      password: DEFAULT_PASSWORD,
      email: `${username}@example.com`,
      name,
      role: 'user',
      status: i % 9 === 8 ? 0 : 1, // 每 9 个禁用 1 个 → 状态图有对比
      createdAt: SEED_DATES[i]
    })
  })
  return rows
}

function loadDB(): UserRow[] {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw) as UserRow[]
  } catch {
    // 存储损坏则重建种子数据
  }
  const seed = buildSeed()
  saveDB(seed)
  return seed
}

function saveDB(rows: UserRow[]) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(rows))
  } catch {
    // 浏览器隐私模式等场景下写入失败，退化为纯内存数据
  }
}

function toVO(row: UserRow): UserVO {
  const { password: _pw, ...vo } = row
  return vo
}

// ==================== 响应工具（与真实后端同构） ====================

function ok<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<BizResult<T>> {
  return { data: { code: 200, message: 'ok', data }, status: 200, statusText: 'OK', headers: {}, config }
}

// 业务失败：HTTP 200 + code != 200 → 走响应拦截器统一弹 message
function bizFail(config: InternalAxiosRequestConfig, message: string): AxiosResponse<BizResult<null>> {
  return { data: { code: 400, message, data: null }, status: 200, statusText: 'OK', headers: {}, config }
}

// HTTP 失败（登录/注册失败等）→ 走响应拦截器的 error 分支，对齐真实后端行为
function httpFail(config: InternalAxiosRequestConfig, status: number, message: string): AxiosResponse<BizResult<null>> {
  return { data: { code: status, message, data: null }, status, statusText: 'Error', headers: {}, config }
}

// ==================== 统计聚合（全部从用户库实时算出，增删改后图表联动） ====================

function getStats() {
  const rows = loadDB()
  return {
    total: rows.length,
    active: rows.filter((r) => r.status === 1).length,
    admin: rows.filter((r) => r.role === 'admin').length,
    year: new Date().getFullYear()
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// 近 N 天注册趋势：按 createdAt 的日期部分聚合
function getTrend(days = 30) {
  const rows = loadDB()
  const result: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    result.push({ date: key, count: rows.filter((r) => r.createdAt.startsWith(key)).length })
  }
  return result
}

function getRoleDistribution() {
  const rows = loadDB()
  return [
    { name: 'admin', value: rows.filter((r) => r.role === 'admin').length },
    { name: 'user', value: rows.filter((r) => r.role === 'user').length }
  ]
}

function getStatusDistribution() {
  const rows = loadDB()
  return [
    { name: '正常', value: rows.filter((r) => r.status === 1).length },
    { name: '禁用', value: rows.filter((r) => r.status === 0).length }
  ]
}

// 近 N 个月注册趋势
function getRegisterMonthly(months = 12) {
  const rows = loadDB()
  const result: { month: string; count: number }[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
    result.push({ month: key, count: rows.filter((r) => r.createdAt.startsWith(key)).length })
  }
  return result
}

// ==================== 路由分发 ====================

async function handle(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method || 'get').toLowerCase()
  const url = (config.url || '').split('?')[0]
  const body = config.data ? (JSON.parse(config.data as string) as Record<string, unknown>) : {}
  const params = (config.params || {}) as Record<string, string | number>
  const db = loadDB()

  // ---- 鉴权 ----
  if (url === '/api/login' && method === 'post') {
    const row = db.find((r) => r.username === body.username)
    if (!row || row.password !== body.password) {
      return httpFail(config, 400, '用户名或密码错误')
    }
    return ok(config, {
      token: `demo-token-${row.id}-${Date.now()}`,
      user: toVO(row)
    })
  }

  if (url === '/api/register' && method === 'post') {
    if (db.some((r) => r.username === body.username)) {
      return httpFail(config, 400, '用户名已存在')
    }
    const row: UserRow = {
      id: Math.max(...db.map((r) => r.id)) + 1,
      username: String(body.username),
      password: String(body.password),
      email: String(body.email),
      name: String(body.name),
      role: 'user',
      status: 1,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    db.push(row)
    saveDB(db)
    return ok(config, toVO(row))
  }

  // ---- 统计 ----
  if (url === '/api/stats' && method === 'get') return ok(config, getStats())
  if (url === '/api/stats/register-trend' && method === 'get') return ok(config, getTrend(Number(params.days) || 30))
  if (url === '/api/stats/role-distribution' && method === 'get') return ok(config, getRoleDistribution())
  if (/^\/api\/stats\/(status-distribution|register-monthly)/.test(url)) {
    if (url.endsWith('status-distribution')) return ok(config, getStatusDistribution())
    return ok(config, getRegisterMonthly(Number(params.months) || 12))
  }

  // ---- 用户列表（分页 + 关键词） ----
  if (url === '/api/users' && method === 'get') {
    const keyword = String(params.keyword ?? '')
    const page = Number(params.page ?? 1)
    const pageSize = Number(params.pageSize ?? 10)
    const filtered = db.filter((r) =>
      r.username.includes(keyword) || r.name.includes(keyword) || r.email.includes(keyword)
    )
    const start = (page - 1) * pageSize
    const data: PageData<UserVO> = {
      list: filtered.slice(start, start + pageSize).map(toVO),
      total: filtered.length
    }
    return ok(config, data)
  }

  // ---- 新增用户 ----
  if (url === '/api/users' && method === 'post') {
    if (db.some((r) => r.username === body.username)) {
      return bizFail(config, '用户名已存在')
    }
    const row: UserRow = {
      id: Math.max(...db.map((r) => r.id)) + 1,
      username: String(body.username),
      password: String(body.password),
      email: String(body.email),
      name: String(body.name),
      role: 'user',
      status: 1,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    db.push(row)
    saveDB(db)
    return ok(config, toVO(row))
  }

  // ---- /api/users/:id 与 /api/users/:id/change-password ----
  const match = url.match(/^\/api\/users\/(\d+)(\/change-password)?$/)
  if (match) {
    const id = Number(match[1])
    const row = db.find((r) => r.id === id)
    if (!row) return bizFail(config, '用户不存在')

    if (match[2] && method === 'post') {
      if (row.username === 'admin') return bizFail(config, '演示模式下不允许修改管理员密码')
      if (row.password !== body.oldPassword) return bizFail(config, '旧密码不正确')
      row.password = String(body.newPassword)
      saveDB(db)
      return ok(config, null)
    }
    if (method === 'get') return ok(config, toVO(row))
    if (method === 'put') {
      if (body.name !== undefined) row.name = String(body.name)
      if (body.email !== undefined) row.email = String(body.email)
      if (body.role !== undefined) row.role = body.role as UserVO['role']
      if (body.status !== undefined) row.status = body.status as UserVO['status']
      saveDB(db)
      return ok(config, toVO(row))
    }
    if (method === 'delete') {
      if (row.username === 'admin') return bizFail(config, '演示模式下不允许删除管理员账号')
      saveDB(db.filter((r) => r.id !== id))
      return ok(config, null)
    }
  }

  return httpFail(config, 404, `演示模式未实现的接口: ${method.toUpperCase()} ${url}`)
}

// 加一点随机延迟，让页面 loading 态真实可见
export const demoAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))
  return handle(config)
}
