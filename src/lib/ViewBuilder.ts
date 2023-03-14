export default class ViewBuilder{
    static getAsArray(view: string){
        return view.split('\n').map( i => i.split('') )
    }

    static getAsString(viewArray: Array<Array<string>>){
        return viewArray.map( (item: any[]) => {
            return item.map( jtem => {
                return jtem.char
            } ).join('')
        } ).join('\n')
    }
}