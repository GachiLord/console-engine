import { Coor } from "../core/interfaces.js";
import Sprite from "../core/Sprite.js";

export default class Player extends Sprite{
    #onGround = true
    #speed = 1
    #defaultCoors

    constructor(coor: Coor, view: string){
        super(coor, view)

        this.#defaultCoors = {...coor}
    }

    added(){
        if (!this._sceneEvents) return;
        
        
        this._sceneEvents.on('keypress', async (key) => {
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