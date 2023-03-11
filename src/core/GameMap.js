import defaultResolution from "../assets/defaultResolution.js"

export default class GameMap{
    #view
    #originSprite
    #resolution

    constructor(view, originSprite, resolution = defaultResolution){
        this.#view = view
        this.#originSprite = originSprite
        this.#resolution = resolution
    }

    getMap(){
        // make arr of view
        let map = this.#view.split('\n')
        map = map.map( i => i.split('') )
        // offset map acc origin sprite pos and resolution
        const origin = this.#originSprite.getState().coor
        map = map.slice(origin.y).slice(0, this.#resolution.height)
        map = map.map( i => {
            return i.slice(origin.x).slice(0, this.#resolution.width)
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