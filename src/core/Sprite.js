import sceneEvents from "./events/sceneEvents.js"
import sleep from "../lib/sleep.js"
import { randomUUID } from 'crypto'
import EventEmitter from "events"
import { AddError } from '../errors/sprite.js'


const spriteEvents = class SpriteEvents extends EventEmitter{}

export default class Sprite{
    _sceneEvents = sceneEvents
    _spriteEvents = new spriteEvents()
    #id = randomUUID()
    _scene
    _state = {
        show: true,
        coor: {x: 0, y: 0},
        sprite: '#'
    }

    /**
     * A constructor function. It is called when a new instance of the class is created.
     * 
     * @constructor
     * @name Sprite
     * @param {{x: number, y: number}} coor
     * @param {string} sprite view of the sprite
     * @param {boolean} show show sprite or not
     */
    constructor(coor, sprite = '#', show = true){
        this._state.coor = coor
        this._state.sprite = sprite
        this._state.show = show
    }

    on(eventName, callback = (e) => {}){
        this._spriteEvents.on(eventName, callback)
    }
    trigger(eventName, data){
        this._spriteEvents.emit(eventName, data)
    }

    /**
     * Setting the scene for the sprite.
     * 
     * @method
     * @name setScene
     * @kind method
     * @memberof Sprite
     * @param {any} scene
     * @returns {void}
     */
    setScene(scene){
        this._scene = scene
    }

    /**
     * Updating state by speed
     * 
     * @async
     * @method
     * @name updateState
     * @kind method
     * @memberof Sprite
     * @param {Object} props
     * @param {number} speedCoef?
     * @returns {Promise<void>}
     */
    async updateState(props, speedCoef = 1){
        if (!this._scene) throw new AddError()

        this._state = {...this._state, ...props}
        this._sceneEvents.emit('update')
        await sleep(speedCoef * 100)
    }

    /**
     * A getter method. It returns the state of the sprite.
     * 
     * @method
     * @name getState
     * @kind method
     * @memberof Sprite
     * @returns {{ show: boolean; coor: { x: number; y: number; }; sprite: string; }}
     */
    getState(){
        return this._state
    }

    /**
     * moving the sprite only in one direction
     * 
     * @async
     * @method
     * @name goStraight
     * @kind method
     * @memberof Sprite
     * @param {number} endCoor
     * @param {string} axis x or y
     * @param {number} speedCoef frame update speed
     * @returns {Promise<void>}
     */
    async goStraight(endCoor, axis = 'x', speedCoef = 1){
        // add listener and going state var
        let isGoing = true
        const setIsGoingToFalse = () => {
            isGoing = false
        }
        this._spriteEvents.once('stopGoing', setIsGoingToFalse)
        // move sprite
        let coor = this._state.coor
        let startCoor = coor[axis]
        const directionCoef = endCoor > startCoor ? 1: -1
        
        while (startCoor !== endCoor && isGoing){
            startCoor += directionCoef
            coor[axis] = startCoor
            await this.updateState({coor: coor}, speedCoef)
        }
        // remove listener
        this._spriteEvents.removeListener('stopGoing', setIsGoingToFalse)
    }

    stopGoing(){
        this.trigger('stopGoing')
    }

    /**
     * A method that moves the sprite to the given coordinates.
     * 
     * @async
     * @method
     * @name goto
     * @kind method
     * @memberof Sprite
     * @param {{x: number, y: number}} coor
     * @param {any} speedCoef frame update speed
     * @returns {Promise<void>}
     */
    async goto(coor, speedCoef){
        await Promise.all([
            this.goStraight(coor.x, 'x', speedCoef),
            this.goStraight(coor.y, 'y', speedCoef)
        ])
    }

    /**
     * A method that hides the sprite.
     * 
     * @method
     * @name hide
     * @kind method
     * @memberof Sprite
     * @returns {void}
     */
    hide(){
        this._state.show = false
    }

    /**
     * A method that shows the sprite.
     * 
     * @method
     * @name show
     * @kind method
     * @memberof Sprite
     * @returns {void}
     */
    show(){
        this._state.show = true
    }
}