// src/types/api.ts

// 后端统一返回信封（对应后端 Result.java）
// T 为占位符：表示"盒子里装的货物类型"，使用时才指定
export interface BizResult<T> {
    // TODO 填 3 个字段：
    // 1. code     —— 业务状态码（你在 HomeView 判断过它 === 200），什么类型？
    // 2. message  —— 提示消息，什么类型？
    // 3. data     —— 货物本体。注意：它的类型不能写死，
    //                应该写"那个占位符字母"本身
    code: number
    message: string
    data: T
}