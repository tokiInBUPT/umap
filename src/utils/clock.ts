export function formatTime(value: number) {
    const result = value % (3600 * 24)
    const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    const m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
    const s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
    return `${h}:${m}:${s}`
}
export function formatTimeR(value: number) {
    const result = value % (3600 * 24)
    const h = Math.floor(result / 3600)
    const m = Math.floor((result / 60) % 60)
    const s = Math.floor(result % 60)
    return (
        (h ? `${h.toString().padStart(2, '0')}时` : '') +
        (h || m ? `${m.toString().padStart(2, '0')}分` : '') +
        `${s.toString().padStart(2, '0')}秒`
    )
}
