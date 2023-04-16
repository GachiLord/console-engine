import defaultResolution from "../assets/defaultResolution"
import Sprite from "./Sprite"
import { IMap, View } from './typing.js'
import ViewBuilder from "../lib/ViewBuilder"


export default class GameMap implements IMap{
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
        let map:View = ViewBuilder.getAsArray(this.#view)
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