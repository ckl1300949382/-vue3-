import { ref } from 'vue'
//封装用户名和密码的判断条件
export function useInputLimit(maxLength = 20) {
    function limitLength(e) {
        let value = e.target.value
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    function limitAlphanumeric(e) {
        let value = e.target.value.replace(/[^\w]/g, '')
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    return { limitLength, limitAlphanumeric }
}

