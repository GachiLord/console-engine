import sleep from "../lib/sleep.js"
import { randomUUID } from 'crypto'
import EventEmitter from "events"
import { AddError } from '../errors/sprite.js'


class SpriteEvents extends EventEmitter{}

export default class Sprite{
    _sceneEvents
    _spriteEvents = new SpriteEvents()
    #id = randomUUID()
    _scene
    _layers
    _state = {
        show: true,
        coor: {x: 0, y: 0},
        sprite: '#'
    }
    _abilities = {
        canMove: true,
        canChangeView: true,
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

        // listen for lifecycle events
        this._spriteEvents.on('added', () => { this.added() })
        this._spriteEvents.on('update', () => { this.updated })
    }

    on(eventName, callback = (e) => {}){
        this._spriteEvents.on(eventName, callback)
    }
    
    once(eventName, callback = (e) => {}){
        this._spriteEvents.once(eventName, callback)
    }

    trigger(eventName, data){
        this._spriteEvents.emit(eventName, data)
    }

    added(){

    }

    updated = () => {

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
    setScene(scene, layers, events){
        this._scene = scene
        this._layers = layers
        this._sceneEvents = events
        this._spriteEvents.emit('added')
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
        if (!this._scene || !this._sceneEvents || !this._layers) throw new AddError()

        this._state = {...this._state, ...props}
        this._sceneEvents.emit('update')
        this._spriteEvents.emit('update', props)
        if (speedCoef > 0) await sleep(speedCoef * 100)
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

    getAbilities(){
        return this._abilities
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
        // move sprite
        let coor = this._state.coor
        let startCoor = coor[axis]
        const directionCoef = endCoor > startCoor ? 1: -1
        

        // get to coor if there is no stopGoing command
        while (startCoor !== endCoor && this._abilities.canMove){
            startCoor += directionCoef
            coor[axis] = startCoor
            await this.updateState({coor: coor}, speedCoef)
        }
        // reset ability flag
        //this._abilities.canMove = true
    }

    disableGoing(){
        this._abilities.canMove = false
    }

    enableGoing(){
        this._abilities.canMove = true
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
        this.updateState({show: false}, 0)
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
        this.updateState({show: true}, 0)
    }
}