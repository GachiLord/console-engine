export default class GameMap{
    #view
    #originSprite

    constructor(view, originSprite){
        this.#view = view
        this.#originSprite = originSprite
    }

    getMap(){
        // make arr of view
        let map = this.#view.split('\n')
        map = map.map( i => i.split('') )
        //
        const origin = this.#originSprite.getState().coor
        map = map.slice(origin.y)
        map = map.map( i => {
            return i.slice(origin.x)
        } )

        return map
    }

    setView(view){
        this.#view = view
    }

    setOrigin(originSprite){
        this.#originSprite = originSprite
    }
}