import { View } from "../core/typing.js"

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

    static getAsString(viewArray: View){
        return viewArray.map( (item: any[]) => {
            return item.map( jtem => {
                return jtem.char
            } ).join('')
        } ).join('\n')
    }
}