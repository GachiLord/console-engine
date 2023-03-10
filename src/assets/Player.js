import Sprite from "../core/Sprite.js";

export default class Player extends Sprite{
    #onGround = true
    #speed = 1

    constructor(coor, view){
        super(coor, view)
        this._spriteEvents.once('added', () => {
            this._onMove()
        })
    }

    _onMove(){
        this._sceneEvents.on('keypress', async (key, data) => {
            const curCoors = this._state.coor
            const delta = 2
            if (key === ' ') {
                if (this.#onGround){
                    this.#onGround = false
                    await this.goto({...curCoors, y: curCoors.y - 4})
                    await this.goto({...curCoors, y: curCoors.y + 4}, this.#speed * 0.5)
                }
                this.#onGround = true
            }
        })
    }

    setSpeed(speed){
        this.#speed = speed
    }


}