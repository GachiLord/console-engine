import { ICoor } from "../../core/typing.js";
import Sprite from "../../core/Sprite.js";

export default class Player extends Sprite{
    #onGround = true
    #speed = 100
    #defaultCoors

    constructor(coor: ICoor, view: string){
        super(coor, view, undefined)

        this.#defaultCoors = {...coor}
    }

    added(){
        this._sceneEvents.on('keypress', async key => {
            const curCoors = this._state.coor
            if (key === ' ') {
                if (this.#onGround){
                    this.#onGround = false
                    await this.goto({...curCoors, y: curCoors.y - 4})
                    await this.goto(this.#defaultCoors, this.#speed * 0.5)
                }
                this.#onGround = true
            }
        })
    }

    setSpeed(speed: number){
        this.#speed = speed
    }


}