// src/types/enums.ts

// 用户角色常量 —— 替代代码里裸写的 'admin' / 'user'
export const RoleEnum = {
    ADMIN: 'admin',
    USER: 'user'
} as const

// 角色类型 —— 与 types/user.ts 中 UserVO.role 保持一致
export type Role = 'admin' | 'user'

// 数字含义参照项目事实：status=1 为活跃（backend stats 统计用过 status=1）
export const StatusEnum = {
    // TODO
    ACTIVE: 1,
    INACTIVE: 0
} as const

export type Status = 0 | 1