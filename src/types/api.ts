export interface BizResult<T> {
    code: number
    message: string
    data: T
}


// 加进 types/api.ts（它和 BizResult 一样属于"通用包装"）
export interface PageData<T> {
    // TODO：两个字段，list 和 total。list 的类型你会写吗？
    // 提示：UserVO 数组的写法是 UserVO[]
    list: T[]
    total: number
}