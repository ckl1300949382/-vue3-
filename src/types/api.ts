export interface BizResult<T> {
    code: number
    message: string
    data: T
}