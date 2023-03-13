import defaultResolution from "../assets/defaultResolution.js"
import Sprite from "./Sprite.js"


export default class GameMap{
    #view
    #originSprite
    #resolution

    constructor(view: string, originSprite: Sprite, resolution = defaultResolution){
        this.#view = view
        this.#originSprite = originSprite
        this.#resolution = resolution
    }

    getMap(){
        // make arr of view
        let map:Array<Array<string>> = this.#view.split('\n').map( i => i.split('') )
        // offset map acc origin sprite pos and resolution
        const origin = this.#originSprite.getState().coor
        map = map.slice(origin.y).slice(0, this.#resolution.height)
        map = map.map( i => {
            return i.slice(origin.x).slice(0, this.#resolution.width)
        } )

        return map
    }

    setView(view: string){
        this.#view = view
    }

    setOrigin(originSprite: Sprite){
        this.#originSprite = originSprite
    }
}