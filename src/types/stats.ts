// 注册趋势的单个数据点（契约：{date: "2026-08-01", count: 3}）
export interface TrendPoint {
    date: string
    count: number
}

// 角色分布的单个数据项（契约：{name: "admin", value: 1}）
export interface RoleItem {
    name: 'admin' | 'user'
    value: number
}

export interface StatusItem {
    name: string,
    value: number
}

export interface MonthlyPoint {
    month: string,
    count: number
}