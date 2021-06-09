export function getDistance({
    lat1,
    lng1,
    lat2,
    lng2,
}: {
    lat1: number
    lng1: number
    lat2: number
    lng2: number
}): number {
    const radLat1 = (lat1 * Math.PI) / 180.0
    const radLat2 = (lat2 * Math.PI) / 180.0
    const a = radLat1 - radLat2
    const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
    let s =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
            ),
        )
    s = s * 6378.137 * 1000 // EARTH_RADIUS;
    return s
}
