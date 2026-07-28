export function useInputLimit(maxLength = 20) {
    function limitLength(value) {
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    function limitAlphanumeric(value) {
        value = value.replace(/[^\w]/g, '')
        if (value.length > maxLength) {
            value = value.slice(0, maxLength)
        }
        return value
    }
    return { limitLength, limitAlphanumeric }
}

