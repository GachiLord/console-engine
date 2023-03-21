import isUnicode from "./isUnicode.js"

export default class ViewBuilder{
    static getAsArray(view: string){
        let lines:Array<Array<string>> = []
        view.split('\n').forEach( line => {
            let curLine = []
            let i = 0
            while( i < line.length){
                if (isUnicode(line[i]) && isUnicode(line[i+1])) {
                    curLine.push(line[i] + line[i+1])
                    i+=2
                }
                else {
                    curLine.push(line[i])
                    i++
                }
            }
            lines.push(curLine)
        } )


        return lines
    }

    static getAsString(viewArray: Array<Array<string>>){
        return viewArray.map( (item: any[]) => {
            return item.map( jtem => {
                return jtem.char
            } ).join('')
        } ).join('\n')
    }
}