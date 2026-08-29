export function useInputLimit(maxLength = 20) {
    function limitLength(value: string) {
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    function limitAlphanumeric(value: string) {
        value = value.replace(/[^\w]/g, '')
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    return { limitLength, limitAlphanumeric }
}

