export interface UserVO {
    id: number
    username: string
    email: string
    name: string
    role: 'admin' | 'user'
    status: 0 | 1
    createdAt: string  // 后端格式化成字符串，如 "2026-08-27 10:30:00"
}

// 登录请求 payload
export interface LoginDTO {
    username: string
    password: string
}

// 注册请求 payload
export interface RegisterDTO {
    username: string
    password: string
    email: string
    name: string
}

// 更新用户请求 payload
export interface UpdateUserDTO {
    name?: string
    email?: string
    role?: 'admin' | 'user'
    status?: 0 | 1
}

// 修改密码请求 payload
export interface ChangePasswordDTO {
    oldPassword: string
    newPassword: string
}

// 用户列表查询参数（分页+搜索）
export interface UserQueryDTO {
    keyword: string
    page: number
    pageSize: number
}