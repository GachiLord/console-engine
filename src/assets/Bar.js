import Sprite from "../core/Sprite.js";
import defaultResolution from "./defaultResolution.js";

export default class Bar extends Sprite{

    #defaultValue

    constructor(coor,
                description = '',
                length = defaultResolution.width, 
                defaultValue = 0, 
                view = { leftBracket: '[', rightBracket: ']', symb: '#' },
                show = true
                )
    {
        super(coor, show)
        this.length = length
        this.#defaultValue = defaultValue
        this.view = view
        this._state.sprite = ''
        this.description = description
    }

    added(){
        this.updateValue(this.#defaultValue)
    }

    updateValue(value, speedCoef = 0){
        this.updateState({sprite: this.description + ' ' + this.getBar(value)}, speedCoef)
    }

    getBar(value){
        if (value <= 1) value = 2
        if (this.length < 0) {
            this.length = 0
            value = 2
        }
        let delta = this.length - value
        if (delta < 0) delta = 0
        return this.view.leftBracket + this.view.symb.repeat(value - 2) + ' '.repeat(delta) + this.view.rightBracket
    }
}