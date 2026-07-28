import { onMounted, onUnmounted } from 'vue'
//键盘的按键控制提交表单封装
export function useKeyboardSubmit(callback, { enable = true } = {}) {
    if (!enable) return
    const handler = (event) => {
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


