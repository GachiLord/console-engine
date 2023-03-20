export default function isUnicode(str: string) {
    for (let i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 255) return true
    }
    return false
}