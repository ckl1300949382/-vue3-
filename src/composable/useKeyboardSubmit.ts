import { onMounted, onUnmounted } from 'vue'
//键盘的按键控制提交表单封装
interface KeyboardOptions {
    enable?: boolean
}

export function useKeyboardSubmit(callback: () => void, { enable = true }: KeyboardOptions = {}) {
    if (!enable) return
    const handler = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            callback()
        }
    }
    onMounted(() => {
        document.addEventListener('keydown', handler)
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', handler)
    })
}


