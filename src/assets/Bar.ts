import { Coor } from "../core/interfaces.js";
import Sprite from "../core/Sprite.js";
import { InvalidValue } from "../errors/index.js";
import defaultResolution from "./defaultResolution.js";

export default class Bar extends Sprite{

    #defaultValue
    length: number;
    view: { leftBracket: string; rightBracket: string; symb: string; };
    description: string;

    constructor(coor: Coor,
                description = '',
                length = defaultResolution.width, 
                defaultValue = 0, 
                view = { leftBracket: '[', rightBracket: ']', symb: '#' },
                )
    {
        super(coor)
        this.length = length
        this.#defaultValue = defaultValue
        this.view = view
        this._state.sprite = ''
        this.description = description
    }

    added(){
        this.updateValue(this.#defaultValue)
    }

    updateValue(value: number, speedCoef = 0){
        this.updateState({sprite: this.description + ' ' + this.getBar(value)}, speedCoef)
    }

    getBar(value: number){
        // validate values
        if (this.length < 0) throw new InvalidValue('length must be positive')
        if (value < 0) throw new InvalidValue('value must be positive')
        // get bar
        let delta = this.length - value
        if (delta < 0) {
            delta = 0
            value = this.length
        }
        
        return this.view.leftBracket + this.view.symb.repeat(value) + ' '.repeat(delta) + this.view.rightBracket
    }
}