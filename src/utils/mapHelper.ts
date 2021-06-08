import userPNG from '@/assets/user.png'
import startPNG from '@/assets/start.png'
import endPNG from '@/assets/end.png'
import markerPNG from '@/assets/marker.png'

export const TMap: any = (<any>window).TMap

export function createRainbowPath(map: any, rainbowPaths: any[]) {
    return new TMap.MultiPolyline({
        map, // 绘制到目标地图
        // 折线样式定义
        styles: {
            style_blue: new TMap.PolylineStyle({
                color: '#3777FF', // 线填充色
                width: 10, // 折线宽度
                borderWidth: 1, // 边线宽度
                borderColor: '#FFF', // 边线颜色
                lineCap: 'round', // 线端头方式
                showArrow: true,
                arrowOptions: {
                    space: 70,
                },
            }),
        },
        geometries: [
            {
                styleId: 'style_blue',
                rainbowPaths,
            },
        ],
    })
}
export function createRouteMarker(map: any, points: any[]) {
    return new TMap.MultiMarker({
        id: 'middle-marker-layer',
        map: map,
        styles: {
            start: new TMap.MarkerStyle({
                width: 25,
                height: 35,
                anchor: { x: 16, y: 32 },
                src: startPNG,
            }),
            end: new TMap.MarkerStyle({
                width: 25,
                height: 35,
                anchor: { x: 16, y: 32 },
                src: endPNG,
            }),
            middle: new TMap.MarkerStyle({
                width: 25,
                height: 35,
                anchor: { x: 16, y: 32 },
                src: markerPNG,
            }),
        },
        geometries: points,
    })
}
export function createUserMarker(map: any, position: any) {
    return new TMap.MultiMarker({
        map: map,
        styles: {
            // 样式设置
            userPNG: new TMap.MarkerStyle({
                width: 40, // 小车图片宽度（像素）
                height: 40, // 高度
                anchor: {
                    // 图片中心的像素位置（小车会保持车头朝前，会以中心位置进行转向）
                    x: 20,
                    y: 20,
                },
                faceTo: 'map', // 取’map’让小车贴于地面，faceTo取值说明请见下文图示
                rotate: 0, // 初始小车朝向（正北0度，逆时针一周为360度，180为正南）
                src: userPNG, // 小车图片（图中小车车头向上，即正北0度）
            }),
        },
        geometries: [
            {
                // 小车marker的位置信息
                id: 'user', // 因MultiMarker支持包含多个点标记，因此要给小车一个id
                styleId: 'userPNG', // 绑定样式
                position,
            },
        ],
    })
}
export function createLabelLayer(map: any, labels: any[]) {
    return new TMap.MultiLabel({
        map: map,
        enableCollision: true,
        styles: {
            label: new TMap.LabelStyle({
                color: '#5e5e5e', // 颜色属性
                size: 15, // 文字大小属性
                offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
                angle: 0, // 文字旋转属性
                alignment: 'center', // 文字水平对齐属性
                verticalAlignment: 'middle', // 文字垂直对齐属性
            }),
        },
        geometries: labels,
    })
}
