import { View, char } from "../core/typing.js"

export default class ViewBuilder{
    static getAsArray(view: string){
        const lines:View = []

        view.split('\n').forEach( line => {
            let curLine = []

            for(const s of new Intl.Segmenter().segment(line)){
                curLine.push(s.segment)
            }

            lines.push(curLine)
        } )
        
        return lines
    }

    static getEmptyViewAsArray(height: number, width: number){
        const view:char[][] = []
        for (let i = height; i > 0; i--) view.push([])
            view.forEach( (item: char[]) => {
                for (let j = 0; j < width; j++) item.push({char: ' ', owner: undefined, layerIndex: undefined })
        } )
        return view
    }

    static joinViews(view1: char[][], view2: char[][]){
        view2.forEach( (line, y) => {
            line.forEach( (char, x) => {
                if ((view1[y][x].layerIndex !== 0) && (char.char !== ' ' || char.layerIndex === 0 )) view1[y][x] = char
            })
        } )
        return view1
    }

    static getAsString(viewArray: char[][]){
        return viewArray.map( (item: any[]) => {
            return item.map( jtem => {
                return jtem.char
            } ).join('')
        } ).join('\n')
    }
}