

//防抖函数 多次点击下执行最后一次
export function useDebounce(fn, delay = 500) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

//节流函数  在一定时间内只执行一次
export function useThrottle(fn, delay = 500) {
    let timer = null
    return function (...args) {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, delay)
    }
}