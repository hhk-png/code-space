interface DrawOptions {
    canvas: HTMLCanvasElement,
    canvasWidth: number,
    canvasHeight?: number,
    drawWidth: number,
    // drawHeight: number,
    lineHeight: number,
    drawStartX: number,
    drawStartY: number,
    font: string,
    color: string,
    backgroundColor: string,
    padding: number
}

const punctuation: string = '.,;?!:"，。？！；：、'

// font width padding

export function canvasWrapText(str: string, options?: DrawOptions) {
    const defaultOptions: DrawOptions = {
        canvas: document.createElement('canvas'),
        canvasWidth: 580,
        drawWidth: 560,
        lineHeight: 20,
        drawStartX: 10,
        drawStartY: 40,
        font: "16px 'Microsoft Yahei'",
        color: "#000",
        backgroundColor: "#fff",
        padding: 10
    }
    if (options) {
        Object.assign(defaultOptions, options)
    }
    const canvas: HTMLCanvasElement = defaultOptions.canvas
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!

    context.font = defaultOptions.font
    context.fillStyle = defaultOptions.color
    let lineWidth: number = 0
    const arr: string[] = []
    let tempStr: string = ''
    for (let i = 0; i < str.length; i++) {
        tempStr += str[i]
        lineWidth = context.measureText(tempStr).width
        if (lineWidth === defaultOptions.drawWidth) {
            if (isPunctuation(str[i + 1])) {
                tempStr += str[i + 1]
                i++
            }
            arr.push(tempStr)
            tempStr = ''
        }
        if (lineWidth > defaultOptions.drawWidth) {
            if (isPunctuation(str[i])) {
                arr.push(tempStr)
            } else {
                arr.push(tempStr.slice(0, -1))
                i--
            }
            tempStr = ''
        }
    }
    if (tempStr.length) arr.push(tempStr)

    defaultOptions.canvasHeight = arr.length * defaultOptions.lineHeight + defaultOptions.drawStartY
    canvas.height = defaultOptions.canvasHeight
    canvas.width = defaultOptions.canvasWidth

    context.fillStyle = defaultOptions.backgroundColor
    context.fillRect(0, 0, defaultOptions.canvasWidth, defaultOptions.canvasHeight)
    context.font = defaultOptions.font
    context.textBaseline = 'bottom'
    context.fillStyle = defaultOptions.color
    for (let i = 0; i < arr.length; i++) {
        context.fillText(arr[i], defaultOptions.drawStartX, defaultOptions.drawStartY + i * defaultOptions.lineHeight)
    }

    return canvas.toDataURL()
}

function isPunctuation(str: string) {
    if (str.length > 1) return false
    return punctuation.indexOf(str) > 0
}
