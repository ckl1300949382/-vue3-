

//防抖函数 多次点击下执行最后一次点击
export function useDebounce(fn: (...args: any[]) => void, delay = 500) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return function (...args: any[]) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

//节流函数  在一定时间内只执行一次
export function useThrottle(fn: (...args: any[]) => void, delay = 500) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return function (...args: any[]) {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, delay)
    }
}