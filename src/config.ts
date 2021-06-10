const M_CONFIG = ((<any>(typeof window === 'undefined' ? {} : window))._M_CONFIG || {}) as {
    clockBase: number
    defaultTimeScale: number
    startPoint: string
    speed: any
    busTimeDIf: number
}
export const clockBase = M_CONFIG.clockBase || 3600 * 8

export const defaultTimeScale = M_CONFIG.defaultTimeScale || 60

export const startPoint = M_CONFIG.startPoint || 'd08cf367-be23-4c1d-a256-db4d8274ad60'

M_CONFIG.speed = M_CONFIG.speed || {}

export const speed = {
    walk: M_CONFIG.speed.walk || 1.4,
    bike: M_CONFIG.speed.bike || 5,
    bus: M_CONFIG.speed.bus || 16,
}

export const busTimeDIf = 45
