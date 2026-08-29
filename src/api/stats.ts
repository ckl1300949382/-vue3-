// src/api/stats.ts
import instance from '@/request'
import type { BizResult } from '@/types/api'
import type { TrendPoint, RoleItem } from '@/types/stats'

// 近 N 天注册趋势，days 默认 30
export const getRegisterTrend = async (days = 30): Promise<BizResult<TrendPoint[]>> => {
    return await instance.request({
        url: '/api/stats/register-trend',
        method: 'get',
        params: { days }
    })
}

// 角色分布
export const getRoleDistribution = async (): Promise<BizResult<RoleItem[]>> => {
    return await instance.request({
        url: '/api/stats/role-distribution',
        method: 'get',

    })
}